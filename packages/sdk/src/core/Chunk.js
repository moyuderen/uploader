import { generateUid } from '../shared'
import { ChunkStatus, FileStatus } from './constants'
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

    this.uid = generateUid()
    this.chunkIndex = index
    this.status = ChunkStatus.Ready
    this.stardByte = this.chunkSize * index
    this.endByte = Math.min(this.stardByte + this.chunkSize, this.totalSize)
    this.size = this.endByte - this.stardByte

    this.maxRetries = this.options.maxRetries

    this.progress = 0
    this.fakeProgress = 0
    this.timer = null

    this.request = null
    this.customRequest = this.options.customRequest || request
  }

  onSuccess(e, response, resolve) {
    if (this.options.requestSucceed(response, this)) {
      this.status = Chunk.Success
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
      reject(this)
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
    const formData = new FormData()
    const blob = this.file.rawFile.slice(this.stardByte, this.endByte)

    formData.append(this.options.name, blob)

    if (this.fileHash) {
      formData.append('hash', this.fileHash)
    }

    formData.append('id', this.uid)
    formData.append('fileId', this.fileId)
    formData.append('index', this.chunkIndex)
    formData.append('filename', this.filename)
    formData.append('size', this.size)
    formData.append('totalSize', this.totalSize)
    formData.append('timestamp', Date.now())

    return formData
  }

  send() {
    this.status = ChunkStatus.Pending
    return new Promise((resolve, reject) => {
      this.request = this.customRequest({
        formData: this.prepare(),
        action: this.options.action,
        data: this.options.data,
        headers: this.options.headers,
        withCredentials: this.options.withCredentials,
        name: this.options.name,
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
      // this.request = null
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
}
