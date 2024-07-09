import { generateUid, each } from '@tinyuploader/utils'
import { Status } from './constans.js'

export default class Chunk {
  constructor(file, chunk, index) {
    this.uploader = file.uploader
    this.opts = file.uploader.opts
    this.file = file
    this.filename = file.name
    this.fileId = file.id
    this.totalSize = file.size
    this.chunkSize = this.opts.chunkSize

    this.id = generateUid('chunk_id')
    this.stardByte = this.chunkSize * index
    this.endByte = Math.min(this.stardByte + this.chunkSize, this.totalSize)
    this.size = this.endByte - this.stardByte
    this.blob = chunk
    this.chunkIndex = index

    this.retries = this.opts.retries
    this.xhr = null
    this.status = Status.Ready
    this.progress = 0
    this.progressInFile = 0
    this.timer = null
  }

  prepareXhr() {
    const data = new FormData()
    this.xhr.responseType = 'json'
    this.xhr.withCredentials = this.opts.withCredentials
    data.append(this.opts.name, this.blob)
    data.append('id', this.id)
    data.append('fileId', this.file.id)
    data.append('index', this.chunkIndex)
    data.append('filename', this.filename)
    data.append('size', this.size)
    data.append('totalSize', this.totalSize)
    data.append('timestamp', Date.now())
    each(this.opts.data, (val, key) => {
      data.append(key, val)
    })
    this.xhr.open('POST', this.opts.target, true)

    // 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED
    if ('setRequestHeader' in this.xhr) {
      each(this.opts.headers, (val, key) => {
        this.xhr.setRequestHeader(key, val)
      })
    }

    return data
  }

  send() {
    return new Promise((resolve, reject) => {
      this.status = Status.Pending

      // eslint-disable-next-line no-unused-vars
      const failHandler = (e) => {
        // console.log(e)
        // this.progress = 0
        // this.progressInFile = 0
        // this.file.setProgress(this)
        if (this.retries <= 0) {
          this.file.removeChunkInUploadingQueue(this)
          this.status = Status.Fail
          if (this.file.status === Status.Uploading) {
            this.file.uploadFile()
          }

          reject(this)
        } else {
          this.timer = setTimeout(() => {
            this.send()
            this.retries--
            clearTimeout(this.timer)
          }, this.uploader.opts.retryInterval)
        }
      }
      const doneHandler = (e) => {
        if (this.uploader.opts.successStatuses(this.xhr)) {
          this.status = Status.Success
          this.file.removeChunkInUploadingQueue(this)
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
        this.progressInFile = this.progress * (this.size / this.file.size)
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
