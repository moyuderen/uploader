import { Status } from "./utils/Status.js"
import each from "./utils/each.js"
import { generateUid } from "./utils/uid.js"

export default class Chunk {
  constructor(file, chunk, index) {
    this.opts = file.uploader.opts
    this.file = file
    this.blob = new Blob([chunk], {type: this.file.type})
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
  }

  send() {
    return new Promise((resolve, reject) => {
      const progressHandler = (e) => {
        this.progress = Math.min(1, e.loaded / e.total)
        this.progressInFile = this.progress * (this.size / this.file.size)
        this.file.setProgress(this)
        this.status = Status.Uploading
        this.file.status = Status.Uploading
      }
      const failHandler = (e) => {
        console.log(e)
        this.status = Status.Fail
        this.file.status = Status.Fail
        reject({
          xhr: this.xhr,
          response: this.xhr.response,
          status: this.xhr.status,
          file: this.file,
          chunk: this,
        })
      }
      const doneHandler = (e) => {
        if(this.xhr.status < 200 || this.xhr.status  >=300) {
          failHandler(e)
          return
        }
        this.status = Status.Success
        resolve({
          xhr: this.xhr,
          response: this.xhr.response,
          status: this.xhr.status,
          statusText: this.xhr.statusText,
        })
      }

      const data = new FormData()
      this.xhr = new XMLHttpRequest()
      this.xhr.responseType = 'json'
      each(this.opts.data, (val, key) => {
        data.append(key, val)
      });
      data.append('file', this.blob)
      this.xhr.upload.addEventListener('progress', progressHandler)
      this.xhr.addEventListener('load', doneHandler, false)
      this.xhr.addEventListener('error', failHandler, false)
      this.xhr.open('POST', this.opts.target, true)
      if ('setRequestHeader' in this.xhr) {
        each(this.opts.headers, (val, key) => {
          this.xhr.setRequestHeader(key, val)
        });
      }
      this.xhr.send(data)   
    })
  }

  abort() {
    if(this.xhr) {
      this.xhr.abort()
    }
  }
}