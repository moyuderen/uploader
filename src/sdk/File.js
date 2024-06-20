import { generateUid } from './shared/uid.js'
import { Status } from './shared/Status.js'
import Chunk from './Chunk.js'

export default class File {
  constructor(uploader, file) {
    this.uploader = uploader
    this.rawFile = file
    this.id = generateUid('fid')
    this.size = file.size
    this.name = file.name || file.fileName
    this.type = file.type
    this.chunkSize = this.uploader.opts.chunkSize
    this.status = Status.Ready
    this.progress = 0
    this.chunks = []
    this.uploadedChunks = []
    this.errorChunks = new Set()
    this.cancelChunks = []
    this.uploadingQueue = new Set()
    this.reqs = new Set()

    this.createChunks()
  }

  createChunks() {
    const blob = new Blob([this.rawFile], {
      size: this.size
    })
    const chunks = this.slice(blob)
    this.chunks = chunks.map((chunk, index) => {
      return new Chunk(this, chunk, index)
    })
  }

  slice(blob, size = this.chunkSize) {
    const fileChunkList = []
    let cur = 0
    while (cur < blob.size) {
      fileChunkList.push(blob.slice(cur, cur + size))
      cur += size
    }
    return fileChunkList
  }

  setProgress() {
    const progress = this.chunks.reduce((total, chunk) => {
      return (total += chunk.progressInFile)
    }, 0)
    this.progress = Math.min(progress, 1)
    if (this.status === Status.Success) {
      this.progress = 1
    }
  }

  upadteRrrorChunks(chunk) {
    this.errorChunks.add(chunk)
  }

  deleteReponseChunkInUploadingQueue(chunk) {
    this.uploadingQueue.delete(chunk)
  }

  send() {
    const readyChunks = this.chunks.filter((chunk) => chunk.status === Status.Ready)
    const run = () => {
      if (this.uploadingQueue.size >= this.uploader.opts.concurrency) {
        return
      }

      while (this.uploadingQueue.size < this.uploader.opts.concurrency && readyChunks.length) {
        const chunk = readyChunks.shift()
        if (chunk) {
          this.uploadingQueue.add(chunk)
        }
      }

      if (this.uploadingQueue.size === 0) {
        if (this.errorChunks.size === 0) {
          this.status = this.errorChunks.size === 0 ? Status.Success : Status.Fail
          this.uploader.upload1()
        }
        return
      }
      Promise.race(
        [...this.uploadingQueue]
          .filter((chunk) => chunk.status === Status.Ready)
          .map((chunk) => chunk.send())
      )
    }
    run()
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
  }

  resume() {
    if (this.status === Status.Uploading) {
      this.send()
    }
  }
}
