import Chunk from './Chunk.js'
import { isFunction, generateUid, asyncComputedHash, isPromise, each } from '@/shared'
import { Status, Events, CheckStatus } from './constans.js'

export default class File {
  constructor(file, uploader) {
    this.uploader = uploader || { opts: {} }
    this.opts = this.uploader.opts

    this.rawFile = file
    if (isFunction(this.opts.customGenerateUid)) {
      this.uid = this.opts.customGenerateUid(file) || generateUid('fid')
    } else {
      this.uid = generateUid('fid')
    }
    this.hash = ''
    this.size = file.size
    this.name = file.name || file.fileName
    this.type = file.type
    this.chunkSize = this.opts.chunkSize

    this.status = file.status || Status.Init
    this.progress = file.progress || 0
    this.chunks = []
    this.uploadingQueue = new Set()
    this.readProgress = 0
    this.path = file.path || ''
  }

  isInited() {
    return this.status === Status.Init
  }

  isReady() {
    return this.status === Status.Ready
  }

  isUploading() {
    return this.status === Status.Uploading
  }

  isSuccess() {
    return this.status === Status.Success
  }

  async start() {
    await this.computedHash()
    this.createChunks()
    if (this.opts.checkFileRequest) {
      await this.checkRequest()
    }
  }

  async checkRequest() {
    try {
      const { status, data } = await this.opts.checkFileRequest(this)
      if (status === CheckStatus.Part) {
        this.chunks.forEach((chunk) => {
          if (data.includes(chunk.chunkIndex)) {
            chunk.status = Status.Success
            chunk.progress = 1
            chunk.fakeProgress = 1
          }
        })
      }
      if (status === CheckStatus.Success) {
        this.success()
        this.chunks.forEach((chunk) => {
          chunk.status = Status.success
        })
        this.path = data
      }
    } catch {
      //
    }
  }

  computedHash() {
    return new Promise((resolve, reject) => {
      if (!this.opts.withHash) {
        resolve()
      }
      this.status = Status.Reading
      asyncComputedHash(
        {
          file: this.rawFile,
          chunkSize: this.chunkSize,
          inWorker: this.opts.computedHashWorker
        },
        ({ progress }) => {
          this.readProgress = progress
        }
      ).then(({ hash }) => {
        this.hash = hash
        resolve()
      })
    })
  }

  createChunks() {
    const totalChunks = (this.totalChunks = Math.ceil(this.size / this.chunkSize))
    for (let i = 0; i < totalChunks; i++) {
      this.chunks.push(new Chunk(this, i))
    }
    this.status = Status.Ready
  }

  setProgress() {
    const progress = this.chunks.reduce((total, chunk) => {
      const p = this.opts.fakeProgress ? chunk.fakeProgress : chunk.progress
      return (total += p * (chunk.size / this.size))
    }, 0)

    // this.progress = Math.max(Math.min(progress, 1), this.progress)
    this.progress = Math.min(1, progress)

    if (this.status === Status.UploadSuccess) {
      this.progress = 1
    }

    this.uploader.emit(Events.FileProgress, this.progress, this, this.uploader.fileList)
  }

  removeUploadingQueue(chunk) {
    this.uploadingQueue.delete(chunk)
  }

  addUploadingQueue(chunk) {
    this.uploadingQueue.add(chunk)
  }

  uploadFile() {
    if (this.status === Status.Success) {
      this.success()
      return
    }

    const readyChunks = this.chunks.filter((chunk) => chunk.status === Status.Ready)

    each(readyChunks, () => {
      if (this.uploadingQueue.size >= this.opts.maxConcurrency) {
        return false // false时break;
      }

      const chunk = readyChunks.shift()
      if (chunk) {
        this.addUploadingQueue(chunk)
      } else {
        return false
      }
    })

    if (this.uploadingQueue.size) {
      // 有的chunk处于pending状态，但是已经准备发起请求了，就不在后面调用其send方法
      const readyInUploadQueue = [...this.uploadingQueue].filter(
        (chunk) => chunk.status === Status.Ready
      )

      Promise.race(readyInUploadQueue.map((chunk) => chunk.send()))
      return
    }

    const hasErrorChunk = this.chunks.some((chunk) => chunk.status === Status.Fail)
    if (hasErrorChunk) {
      this.uploadFail()
    } else {
      this.uploadSuccess()
      this.setProgress()
      this.merge()
    }
  }

  uploadSuccess() {
    this.status = Status.UploadSuccess
    this.uploader.emit(Events.FileUploadSuccess, this, this.uploader.fileList)
  }

  uploadFail() {
    this.status = Status.UploadFail
    this.uploader.emit(Events.FileUploadFail, this, this.uploader.fileList)
    this.uploader.upload()
  }

  success() {
    this.status = Status.Success
    this.progress = 1
    this.uploader.emit(Events.FileSuccess, this, this.uploader.fileList)
    this.uploader.upload()
  }

  mergeFail() {
    this.status = Status.Fail
    this.uploader.emit(Events.FileFail, this, this.uploader.fileList)
    this.uploader.upload()
  }

  merge() {
    const merge = this.opts.mergeRequest
    if (!isFunction(merge)) {
      this.success()
      return
    }

    const result = merge(this)

    if (isPromise(result)) {
      result.then(
        () => this.success(),
        () => this.mergeFail()
      )
    } else {
      result ? this.success() : this.mergeFail()
    }
  }

  retry() {
    if (this.status === Status.UploadSuccess || this.status === Status.Fail) {
      this.merge()
      return
    }
    if (this.status === Status.UploadFail) {
      each(this.chunks, (chunk) => {
        if (chunk.status === Status.Fail) {
          chunk.status = Status.Ready
          chunk.maxRetries = this.opts.maxRetries
        }
      })

      this.uploadFile()
    }
  }

  remove() {
    this.chunks = []
    this.uploadingQueue.forEach((chunk) => {
      chunk.abort()
    })
  }

  pause() {
    this.uploadingQueue.forEach((chunk) => {
      chunk.abort()
    })
    this.status = Status.Pause
    this.uploader.upload()
  }

  resume() {
    if (this.status === Status.Pause) {
      this.status = Status.Resume
      this.uploader.pauseUploadingFiles()
      this.uploader.upload()
    }
  }
}
