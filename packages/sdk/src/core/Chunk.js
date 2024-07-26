import { generateUid, each } from '@/shared'
import { Status } from './constans.js'

export default class Chunk {
  constructor(file, index) {
    this.uploader = file.uploader
    this.opts = file.uploader.opts
    this.file = file
    this.filename = file.name
    this.fileId = file.uid
    this.totalSize = file.size
    this.chunkSize = this.opts.chunkSize

    this.fileHash = this.file.hash
    this.uid = generateUid('chunk_id')
    this.stardByte = this.chunkSize * index
    this.endByte = Math.min(this.stardByte + this.chunkSize, this.totalSize)
    this.size = this.endByte - this.stardByte
    this.chunkIndex = index

    this.maxRetries = this.opts.maxRetries
    this.xhr = null
    this.promise = null
    this.status = Status.Ready
    this.progress = 0
    this.fakeProgress = 0
    this.timer = null
  }

  prepareXhr() {
    const data = new FormData()
    this.xhr.responseType = 'json'
    this.xhr.withCredentials = this.opts.withCredentials
    const blob = this.file.rawFile.slice(this.stardByte, this.endByte)

    data.append(this.opts.name, blob)
    if (this.fileHash) {
      data.append('hash', this.fileHash)
    }
    data.append('id', this.uid)
    data.append('fileId', this.fileId)
    data.append('index', this.chunkIndex)
    data.append('filename', this.filename)
    data.append('size', this.size)
    data.append('totalSize', this.totalSize)
    data.append('timestamp', Date.now())
    each(this.opts.data, (val, key) => {
      data.append(key, val)
    })
    this.xhr.open('POST', this.opts.action, true)

    // 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED
    if ('setRequestHeader' in this.xhr) {
      each(this.opts.headers, (val, key) => {
        this.xhr.setRequestHeader(key, val)
      })
    }

    return data
  }

  async send() {
    return new Promise(async (resolve, reject) => {
      this.status = Status.Pending

      // eslint-disable-next-line no-unused-vars
      const failHandler = (e) => {
        this.progress = 0
        this.file.setProgress(this)
        if (this.maxRetries <= 0) {
          this.file.removeUploadingQueue(this)
          this.status = Status.Fail
          if (this.file.status === Status.Uploading) {
            this.file.uploadFile()
          }

          reject(this)
        } else {
          this.timer = setTimeout(() => {
            this.send()
            this.maxRetries--
            clearTimeout(this.timer)
          }, this.uploader.opts.retryInterval)
        }
      }
      const doneHandler = (e) => {
        if (this.uploader.opts.requestSucceed(this.xhr)) {
          this.status = Status.Success
          this.file.removeUploadingQueue(this)
          if (this.file.status === Status.Uploading) {
            this.file.uploadFile()
          }
          resolve(this)
        } else {
          failHandler(e)
        }
      }

      const progressHandler = (e) => {
        this.progress = Math.min(1, e.loaded / e.total)
        this.fakeProgress = Math.max(this.progress, this.fakeProgress)

        this.status = Status.Uploading
        this.file.status = Status.Uploading
        this.file.setProgress(this)
      }

      this.xhr = new XMLHttpRequest()
      const data = this.prepareXhr()
      this.xhr.upload.addEventListener('progress', progressHandler)
      this.xhr.addEventListener('load', doneHandler, false)
      this.xhr.addEventListener('error', failHandler, false)
      this.xhr.send(data)
    })
  }

  abort() {
    this.status = Status.Ready
    if (this.xhr) {
      this.xhr.abort()
      // this.xhr = null 避免缓存xhr，使用旧的xhr重新发起导致请求失败
      this.xhr = null
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  cancel() {
    if (this.status === Status.Pending || this.status === Status.Uploading) {
      this.status = Status.Ready
      this.abort()
    }
  }
}
