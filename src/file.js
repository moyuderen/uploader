import { generateUid } from "./utils/uid.js"
import { Status } from "./utils/Status.js"
import Chunk from "./chuk.js"

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
    this.upladingChunks = []
    this.uploadedChunks = []
    this.errorChunks = []
    this.cancelChunks = []
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
    const fileChunkList = [];
    let cur = 0;
    while (cur < blob.size) {
      fileChunkList.push(blob.slice(cur, cur + size));
      cur += size;
    }
    return fileChunkList;
  }

  setProgress() {
    this.progress = this.chunks.reduce((total, chunk) => {
      return total += chunk.progressInFile
    },0)
    this.progress =  Math.min(this.progress, 1)
    console.log(this.status)
    if(this.status === Status.Success) {
      this.progress = 1
    }
  }
}
