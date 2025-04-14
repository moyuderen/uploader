import Chunk from './Chunk'
import { FileStatus, Callbacks, CheckStatus, ChunkStatus } from './constants'
import {
  generateUid,
  isFunction,
  asyncCancellableComputedHash,
  each,
  isPromise,
  throttle
} from '../shared'

export default class File {
  constructor(file, uploader, defaults) {
    this.uploader = uploader
    this.options = this.uploader.options
    this.uid = this.generateId()

    this.prevStatusLastRecord = []
    // this.status - FileStatus.Init

    this.rawFile = file
    this.name = file.name || file.fileName
    this.size = file.size
    this.type = file.type
    this.hash = ''
    this.url = ''

    this.progress = 0
    this.chunkSize = this.options.chunkSize
    this.chunks = []
    this.totalChunks = 0
    this.uploadingChunks = new Set()
    this.readProgress = 0
    this.errorMessage = ''
    this.data = {}

    if (defaults) {
      Object.keys(defaults).forEach((key) => {
        this[key] = defaults[key]
      })

      this.name = defaults.name
      this.url = defaults.url
      this.readProgress = 1
      this.progress = 1
      this.changeStatus(FileStatus.Success)
    } else {
      this.changeStatus(FileStatus.Init)
    }
  }

  generateId() {
    const customGenerateUid = this.options.customGenerateUid
    if (!customGenerateUid) {
      return generateUid()
    }

    if (!isFunction(customGenerateUid)) {
      console.warn('customGenerateUid must be a function')
      return generateUid()
    }

    return customGenerateUid(this) || generateUid()
  }

  setErrorMessage(message) {
    this.errorMessage = message
    return true
  }

  setData(data) {
    this.data = data
    return true
  }

  get renderSize() {
    const value = this.size
    const ONE_KB = 1024
    if (null == value || value == '') {
      return '0 B'
    }
    var unitArr = new Array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
    var index = 0
    var srcsize = parseFloat(value)
    index = Math.floor(Math.log(srcsize) / Math.log(ONE_KB))
    var size = srcsize / Math.pow(ONE_KB, index)
    size = size.toFixed(2) //保留的小数位数
    return size + ' ' + unitArr[index]
  }

  changeStatus(newStatus) {
    if (newStatus !== this.status || newStatus === FileStatus.Reading) {
      this.prevStatusLastRecord.push(this.status)
      this.status = newStatus
      // 兼容默认值时没有uploader实例
      if (this.uploader && this.uploader.emitCallback) {
        this.uploader.emitCallback(Callbacks.FileChange, this)
      }
    }
  }

  isInit() {
    return this.status === FileStatus.Init
  }

  isAddFail() {
    return this.status === FileStatus.AddFail
  }

  isReading() {
    return this.status === FileStatus.Reading
  }

  isReady() {
    return this.status === FileStatus.Ready
  }

  isCheckFail() {
    return this.status === FileStatus.CheckFail
  }

  isUploading() {
    return this.status === FileStatus.Uploading
  }

  isUploadSuccess() {
    return this.status === FileStatus.UploadSuccess
  }

  isUploadFail() {
    return this.status === FileStatus.UploadFail
  }

  isSuccess() {
    return this.status === FileStatus.Success
  }

  isFail() {
    return this.status === FileStatus.Fail
  }

  isPause() {
    return this.status === FileStatus.Pause
  }

  isResume() {
    return this.status === FileStatus.Resume
  }

  createChunks() {
    const totalChunks = (this.totalChunks = Math.ceil(this.size / this.chunkSize))
    for (let i = 0; i < totalChunks; i++) {
      this.chunks.push(new Chunk(this, i))
    }
  }

  async read() {
    if (this.options.withHash) {
      this.uploader.emitCallback(Callbacks.FileReadStart, this)
      this.changeStatus(FileStatus.Reading)
      try {
        const startTime = Date.now()
        const { hash } = await this.computedHash()
        this.hash = hash
        this.uploader.emitCallback(Callbacks.FileReadEnd, this)
        this.abortRead = null
        const endTime = Date.now()
        console.log(
          `${this.options.useWebWoker ? 'Web Worker' : 'Normal'} Read file cost`,
          (endTime - startTime) / 1000,
          's'
        )
      } catch (e) {
        this.abortRead = null
        this.changeStatus(FileStatus.Init)
        throw new Error((e && e.message) || 'read file error')
      }
    }
    this.createChunks()
    this.changeStatus(FileStatus.Ready)
  }

  async computedHash() {
    const updateReadProgress = (readProgress) => {
      this.readProgress = readProgress
      this.uploader.emitCallback(Callbacks.FileReadProgress, this)
    }

    let throttlReadProgressleHandle = throttle(updateReadProgress, 100)

    const { promise, abort } = asyncCancellableComputedHash(
      {
        file: this.rawFile,
        chunkSize: this.chunkSize,
        useWebWoker: this.options.useWebWoker
      },
      ({ progress: readProgress }) => {
        throttlReadProgressleHandle(readProgress)
      }
    )
    this.abortRead = abort
    const hashResult = await promise
    updateReadProgress(hashResult.progress)
    return hashResult
  }

  async checkRequest() {
    const check = this.options.checkRequest
    const checkStatusFn = (checkStatus, data, resolve) => {
      if (checkStatus === CheckStatus.Part) {
        this.chunks.forEach((chunk) => {
          if (data.includes(chunk.chunkIndex)) {
            chunk.status = ChunkStatus.Success
            chunk.progress = 1
            chunk.fakeProgress = 1
          }
        })
      }

      if (checkStatus === CheckStatus.WaitMerge) {
        this.changeStatus(FileStatus.UploadSuccess)
        this.chunks.forEach((chunk) => {
          chunk.status = ChunkStatus.success
        })
      }

      if (checkStatus === CheckStatus.Success) {
        this.changeStatus(FileStatus.Success)
        this.chunks.forEach((chunk) => {
          chunk.status = ChunkStatus.success
        })
        this.url = data
      }
      resolve()
    }

    const rejectCheck = (reject) => {
      this.changeStatus(FileStatus.CheckFail)
      this.uploader.upload()
      reject(new Error('checkRequest error'))
    }

    return new Promise(async (resolve, reject) => {
      if (!isFunction(check)) {
        resolve()
      }

      const result = check(this)

      if (isPromise(result)) {
        try {
          const data = await result
          data ? checkStatusFn(data.status, data.data, resolve) : rejectCheck(reject)
        } catch {
          rejectCheck(reject)
        }
      } else {
        result ? checkStatusFn(result.status, result.data, resolve) : rejectCheck(reject)
      }
    })
  }

  addUploadingChunk(chunk) {
    this.uploadingChunks.add(chunk)
  }

  removeUploadingChunk(chunk) {
    this.uploadingChunks.delete(chunk)
  }

  async upload() {
    if (this.isInit()) {
      await this.read()
    }

    if (this.isReady() && this.options.checkRequest) {
      await this.checkRequest()
    }

    if (this.isUploadSuccess()) {
      this.merge()
      return
    }

    if (this.isSuccess()) {
      this.success()
      return
    }

    const readyChunks = this.chunks.filter((chunk) => chunk.status === ChunkStatus.Ready)

    each(readyChunks, () => {
      if (this.uploadingChunks.size >= this.options.maxConcurrency) {
        return false
      }

      const chunk = readyChunks.shift()
      if (chunk) {
        this.addUploadingChunk(chunk)
      } else {
        return false
      }
    })

    if (this.uploadingChunks.size > 0) {
      // 有的chunk处于pending状态，但是已经准备发起请求了，就不在后面调用其send方法
      const readyInUploadQueue = [...this.uploadingChunks].filter(
        (chunk) => chunk.status === ChunkStatus.Ready
      )

      Promise.race(readyInUploadQueue.map((chunk) => chunk.send()))
      return
    }
    // console.log('hasErrorChunk', readyChunks, this.uploadingChunks)
    const hasErrorChunk = this.chunks.some((chunk) => chunk.status === ChunkStatus.Fail)
    if (hasErrorChunk) {
      this.uploadFail()
    } else {
      this.uploadSuccess()
      this.setProgress()
      this.merge()
    }
  }

  setProgress() {
    const progress = this.chunks.reduce((total, chunk) => {
      const p = this.options.fakeProgress ? chunk.fakeProgress : chunk.progress
      return (total += p * (chunk.size / this.size))
    }, 0)

    this.progress = Math.min(1, progress)

    if (this.isUploadSuccess() || this.isSuccess()) {
      this.progress = 1
    }

    this.uploader.emitCallback(Callbacks.FileProgress, this)
  }

  uploadFail() {
    this.changeStatus(FileStatus.UploadFail)
    this.uploader.emitCallback(Callbacks.FileUploadFail, this)
    this.continueUpload()
  }

  uploadSuccess() {
    this.changeStatus(FileStatus.UploadSuccess)
    this.uploader.emitCallback(Callbacks.FileUploadSuccess, this)
  }

  merge() {
    const merge = this.options.mergeRequest
    if (!isFunction(merge)) {
      this.success()
      return
    }

    const result = merge(this)

    if (isPromise(result)) {
      result.then(
        (data) => {
          data === true ? this.success() : this.mergeFail()
        },
        () => this.mergeFail()
      )
    } else {
      result ? this.success() : this.mergeFail()
    }
  }

  mergeFail() {
    this.changeStatus(FileStatus.Fail)
    this.uploader.emitCallback(Callbacks.FileFail, this)
    this.continueUpload()
  }

  success() {
    this.changeStatus(FileStatus.Success)
    this.progress = 1
    this.uploader.emitCallback(Callbacks.FileSuccess, this)
    this.continueUpload()
  }

  continueUpload() {
    let firstPauseFile
    for (let i = 0; i < this.uploader.fileList.length; i++) {
      const file = this.uploader.fileList[i]
      if (file.isPause()) {
        firstPauseFile = file
        break
      }
    }
    if (firstPauseFile) {
      firstPauseFile.resume()
    }

    this.uploader.upload()
  }

  cancel() {
    this.uploadingChunks.forEach((chunk) => {
      chunk.abort()
    })
    this.uploadingChunks.clear()
  }

  async remove() {
    if (this.abortRead) {
      this.abortRead()
    }

    setTimeout(() => {
      this.cancel()
      this.chunks = []
      this.changeStatus('removed')

      const index = this.uploader.fileList.indexOf(this)
      if (index > -1) {
        this.uploader.fileList.splice(index, 1)
      }
      this.uploader.emitCallback(Callbacks.FileRemove, this)
      this.uploader.upload()
    }, 0)
  }

  pause() {
    if (this.abortRead) {
      this.abortRead()
    }
    setTimeout(() => {
      this.cancel()
      this.changeStatus(FileStatus.Pause)
      this.uploader.emitCallback(Callbacks.FilePause, this)
      this.uploader.upload()
    }, 0)
  }

  resume() {
    if (this.isPause()) {
      this.changeStatus(FileStatus.Resume)
      this.uploader.emitCallback(Callbacks.FileResume, this)
      this.uploader.upload()
    }
  }

  retry() {
    if (this.isAddFail()) {
      return
    }

    if (this.isCheckFail()) {
      this.changeStatus(FileStatus.Ready)
      this.upload()
      return
    }

    if (this.isUploadSuccess() || this.isFail()) {
      this.merge()
      return
    }

    if (this.isUploadFail()) {
      each(this.chunks, (chunk) => {
        if (chunk.status === ChunkStatus.Fail) {
          chunk.status = ChunkStatus.Ready
          chunk.maxRetries = chunk.options.maxRetries
        }
      })

      this.upload()
    }
  }
}
