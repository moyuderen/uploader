import { Status } from './shared/Status.js'
import each from './shared/each.js'
import { generateUid } from './shared/uid.js'

export default class Chunk {
  constructor(file, chunk, index) {
    this.opts = file.uploader.opts
    this.file = file
    this.uploader = this.file.uploader
    this.blob = new Blob([chunk], { type: this.file.type })
    this.size = this.blob.size
    this.chunkIndex = index
    this.filename = file.name
    this.totalSize = file.size
    this.fileId = file.id
    this.xhr = null
    this.status = Status.Ready
    this.progress = 0
    this.progressInFile = 0
    this.id = generateUid('chunk_id')
    this.retries = this.uploader.opts.retries
    this.timer = null
  }

  send(isRetry) {
    return new Promise((resolve, reject) => {
      this.status = Status.Pending
      const progressHandler = (e) => {
        this.progress = Math.min(1, e.loaded / e.total)
        this.progressInFile = this.progress * (this.size / this.file.size)
        this.file.setProgress(this)
        this.status = Status.Uploading
        this.file.status = Status.Uploading
      }
      const failHandler = (e) => {
        this.status = Status.Fail
        // this.progress = 0
        // this.progressInFile = 0
        // this.file.setProgress(this)
        if (this.retries <= 0) {
          this.file.deleteReponseChunkInUploadingQueue(this)

          if (isRetry) {
            this.file.retryErrorChunks.add(this)
            this.file.errorChunks.delete(this)
          } else {
            this.file.upadteRrrorChunks(this)
          }
          this.file.send(isRetry)
          reject({
            xhr: this.xhr,
            response: this.xhr.response,
            status: this.xhr.status,
            file: this.file,
            chunk: this,
            e: e
          })
        } else {
          this.timer = setTimeout(() => {
            this.send()
            this.retries--
            clearTimeout(this.timer)
          }, this.uploader.opts.retryInterval)
        }
      }
      const doneHandler = (e) => {
        if (this.xhr.status < 200 || this.xhr.status >= 300) {
          failHandler(e)
          return
        }
        if (this.uploader.opts.successStatuses(this.xhr)) {
          this.status = Status.Success
          this.file.deleteReponseChunkInUploadingQueue(this)
          if (this.file.errorChunks.has(this)) {
            this.file.errorChunks.delete(this)
          }
          if (isRetry) {
            this.file.retryErrorChunks.delete(this)
          }
          this.file.send(isRetry)
          resolve({
            xhr: this.xhr,
            response: this.xhr.response,
            status: this.xhr.status,
            statusText: this.xhr.statusText
          })
        } else {
          failHandler(e)
        }
      }

      const data = new FormData()
      this.xhr = new XMLHttpRequest()
      this.xhr.responseType = 'json'
      each(this.opts.data, (val, key) => {
        data.append(key, val)
      })
      data.append(this.file.uploader.opts.name, this.blob)
      data.append('id', this.id)
      data.append('fileId', this.file.id)
      data.append('index', this.chunkIndex)
      data.append('filename', this.filename)
      data.append('size', this.size)
      data.append('totalSize', this.totalSize)
      this.xhr.upload.addEventListener('progress', progressHandler)
      this.xhr.addEventListener('load', doneHandler, false)
      this.xhr.addEventListener('error', failHandler, false)
      this.xhr.open('POST', this.opts.target, true)
      if ('setRequestHeader' in this.xhr) {
        each(this.opts.headers, (val, key) => {
          this.xhr.setRequestHeader(key, val)
        })
      }
      this.xhr.send(data)
    })
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort()
      if (this.timer) {
        clearTimeout(this.timer)
      }
    }
  }

  cancel() {
    if (this.status === Status.Pending || this.status === Status.Uploading) {
      this.status = Status.Ready
      this.abort()
    }
  }
}
