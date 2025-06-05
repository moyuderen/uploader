import Chunk from './Chunk'
import { FileStatus, Callbacks, CheckStatus, ChunkStatus, ProcessType } from './constants'
import {
  generateUid,
  isFunction,
  isBoolean,
  each,
  throttle,
  renderSize,
  parseData
} from '../shared'

export default class File {
  constructor(file, uploader, defaults) {
    this.uploader = uploader
    this.options = this.uploader.options
    this.hasher = this.uploader.hasher
    this.uid = this.generateId()

    this.prevStatusLastRecord = []

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
    const { customGenerateUid } = this.options
    if (!isFunction(customGenerateUid)) return generateUid()
    return customGenerateUid(this) || generateUid()
  }

  setErrorMessage(message) {
    this.errorMessage = String(message)
    return this
  }

  setData(data) {
    this.data = { ...this.data, ...data }
    return this
  }

  get renderSize() {
    return renderSize(this.size)
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
    this.totalChunks = Math.ceil(this.size / this.chunkSize) || 1
    this.chunks = Array.from({ length: this.totalChunks }, (_, i) => new Chunk(this, i))
  }

  async read() {
    if (!this.options.withHash) {
      this.createChunks()
      this.changeStatus(FileStatus.Ready)
      return
    }

    this.uploader.emitCallback(Callbacks.FileReadStart, this)
    this.changeStatus(FileStatus.Reading)

    try {
      const startTime = Date.now()
      const { hash, progress } = await this._computeHash()
      this.hash = hash
      this.readProgress = progress
      this.uploader.emitCallback(Callbacks.FileReadEnd, this)
      console.log(
        `${this.options.useWebWoker ? 'Web Worker' : 'Main Thread'} read file took`,
        (Date.now() - startTime) / 1000,
        's'
      )
    } catch (error) {
      this.setErrorMessage('File read failed')
      this.changeStatus(FileStatus.Init)
      this.uploader.emitCallback(Callbacks.FileReadFail, this)
      throw error
    } finally {
      this.abortRead = null
    }

    this.createChunks()
    this.changeStatus(FileStatus.Ready)
  }

  async _computeHash() {
    const updateReadProgress = throttle((progress) => {
      this.readProgress = progress
      this.uploader.emitCallback(Callbacks.FileReadProgress, this)
    }, 200)

    const { promise, abort } = this.hasher.computedHash(
      {
        file: this.rawFile,
        chunkSize: this.chunkSize,
        useWebWoker: this.options.useWebWoker
      },
      ({ progress: readProgress }) => updateReadProgress(readProgress)
    )

    this.abortRead = abort
    const hashResult = await promise
    updateReadProgress(hashResult.progress)
    return hashResult
  }

  _processData(processType) {
    const { data: optionData, processData } = this.options
    const defaults = { ...parseData(optionData), ...this.data }
    if (!isFunction(processData)) {
      return defaults
    }
    return processData(defaults, processType) || defaults
  }

  async checkRequest() {
    const { checkRequest: check } = this.options

    // 提前处理非函数情况
    if (!isFunction(check)) {
      return Promise.resolve()
    }

    // 统一状态修改方法
    const updateChunksStatus = (status) => {
      this.chunks.forEach((chunk) => {
        chunk.status = status
        if (status === ChunkStatus.Success) {
          chunk.progress = 1
          chunk.fakeProgress = 1
        }
      })
    }

    // 状态处理策略模式
    const statusHandlers = {
      [CheckStatus.Part]: (data) => {
        this.chunks.forEach((chunk) => {
          if (data.includes(chunk.chunkIndex)) {
            chunk.status = ChunkStatus.Success
            chunk.progress = 1
            chunk.fakeProgress = 1
          }
        })
      },
      [CheckStatus.WaitMerge]: () => {
        this.changeStatus(FileStatus.UploadSuccess)
        updateChunksStatus(ChunkStatus.Success)
      },
      [CheckStatus.Success]: (data) => {
        this.changeStatus(FileStatus.Success)
        updateChunksStatus(ChunkStatus.Success)
        this.url = data
      },
      [CheckStatus.None]: () => {}
    }

    try {
      const result = await Promise.resolve(
        check(this, this._processData(ProcessType.Check), parseData(this.options.headers))
      ) // 统一异步处理

      // 验证响应格式
      if (!result || !result.status) {
        throw new Error('Invalid check response format')
      }

      const handler = statusHandlers[result.status]
      if (!handler) {
        throw new Error(`Unknown check status: ${result.status}`)
      }

      handler(result.data)
      return Promise.resolve()
    } catch (error) {
      // 统一错误处理
      this.changeStatus(FileStatus.CheckFail)
      this.uploader.upload()

      // 增强错误信息
      const enhancedError = new Error(`Check request failed: ${error.message}`)
      enhancedError.originalError = error
      throw enhancedError
    }
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
      return this.merge()
    }

    if (this.isSuccess()) {
      return this.success()
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
    this._continueUpload()
  }

  uploadSuccess() {
    this.changeStatus(FileStatus.UploadSuccess)
    this.uploader.emitCallback(Callbacks.FileUploadSuccess, this)
  }

  async merge() {
    const { mergeRequest: merge } = this.options

    // 非函数处理提前终止
    if (!isFunction(merge)) {
      return this.success()
    }

    try {
      const result = merge(
        this,
        this._processData(ProcessType.Merge),
        parseData(this.options.headers)
      )
      const data = await Promise.resolve(result)
      if (isBoolean(data)) {
        data ? this.success() : this.mergeFail()
      } else {
        this.url = data
        this.success()
      }
    } catch (error) {
      console.log(error)
      this.mergeFail()
    }
  }

  mergeFail() {
    this.changeStatus(FileStatus.Fail)
    this.uploader.emitCallback(Callbacks.FileFail, this)
    this._continueUpload()
  }

  success() {
    this.changeStatus(FileStatus.Success)
    this.progress = 1
    this.uploader.emitCallback(Callbacks.FileSuccess, this)
    this._continueUpload()
  }

  _continueUpload() {
    const firstPauseFile = this.uploader.fileList.find((file) => file.isPause())
    if (firstPauseFile) {
      firstPauseFile.resume()
    }
    this.uploader.upload()
  }

  cancel() {
    this.uploadingChunks.forEach((chunk) => chunk.abort())
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
