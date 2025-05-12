import { generateUid, isFunction } from '../shared'
import { ChunkStatus, FileStatus, ProcessType } from './constants'
import { request } from './request'

export default class Chunk {
  constructor(file, index) {
    this.uploader = file.uploader
    this.options = file.uploader.options

    this.file = file
    this.rawFile = file.rawFile
    this.fileId = file.uid
    this.fileHash = file.hash
    this.filename = file.name
    this.totalSize = file.size
    this.chunkSize = this.options.chunkSize
    this.totalChunks = file.totalChunks

    this.uid = generateUid()
    this.chunkIndex = index
    this.status = ChunkStatus.Ready
    this.startByte = this.chunkSize * index
    this.endByte = Math.min(this.startByte + this.chunkSize, this.totalSize)
    this.size = this.endByte - this.startByte

    this.maxRetries = this.options.maxRetries

    this.progress = 0
    this.fakeProgress = 0
    this.timer = null

    this.request = null
    this.customRequest = this.options.customRequest || request
  }

  onSuccess(e, response, resolve) {
    if (this.options.requestSucceed(response, this)) {
      this.status = ChunkStatus.Success
      this.file.removeUploadingChunk(this)
      if (this.file.isUploading()) {
        this.file.upload()
      }
      resolve(this)
    } else {
      this.onFail(e)
    }
  }

  onFail(e, reject) {
    this.progress = 0
    this.file.setProgress(this)
    if (this.request.canceled) {
      return
    }
    if (this.maxRetries <= 0) {
      this.file.removeUploadingChunk(this)
      this.status = ChunkStatus.Fail
      if (this.file.isUploading()) {
        this.file.upload()
      }
      reject(e, this)
    } else {
      this.timer = setTimeout(() => {
        this.send()
        this.maxRetries--
        clearTimeout(this.timer)
      }, this.options.retryInterval)
    }
  }

  onProgress(e) {
    this.progress = Math.min(1, e.loaded / e.total)
    this.fakeProgress = Math.max(this.progress, this.fakeProgress)

    this.status = ChunkStatus.Uploading
    this.file.changeStatus(FileStatus.Uploading)
    this.file.setProgress(this)
  }

  prepare() {
    const { name, data, processData } = this.options
    const { data: fileData } = this.file
    const defaults = {
      [name]: this.file.rawFile.slice(this.startByte, this.endByte),
      hash: this.fileHash,
      id: this.uid,
      fileId: this.fileId,
      index: this.chunkIndex,
      filename: this.filename,
      size: this.size,
      totalSize: this.totalSize,
      totalChunks: this.totalChunks,
      ...data,
      ...fileData
    }
    if (!isFunction(processData)) {
      return defaults
    }
    return processData(defaults, ProcessType.Upload) || defaults
  }

  send() {
    this.status = ChunkStatus.Pending
    const { action, headers, withCredentials, name } = this.options

    return new Promise((resolve, reject) => {
      this.request = this.customRequest({
        action,
        name,
        withCredentials,
        headers,
        data: this.prepare(),
        onSuccess: (e, response) => this.onSuccess(e, response, resolve),
        onFail: (e) => this.onFail(e, reject),
        onProgress: (e) => this.onProgress(e)
      })
      this.request.canceled = false
    })
  }

  abort() {
    this.status = ChunkStatus.Ready
    if (this.request) {
      this.request.canceled = true
      this.request.abort()
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
}
