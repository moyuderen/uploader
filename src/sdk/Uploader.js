import extend from './shared/extend.js'
import each from './shared/each.js'
import { pool } from './shared/pool.js'
import { Status } from './shared/Status.js'
import File from './File.js'
import Event from './shared/event.js'

const defaultOptions = {
  target: 'https://jsonplaceholder.typicode.com/posts',
  multipart: true, // 是否分片上传，false时单文件上传
  withCredentials: true,
  headers: {
    name: 'hah'
  },
  data: {},
  concurrency: 10,
  chunkSize: 2 * 1024 * 1,
  autoUpload: true,
  name: 'file',
  generateUniqueIdentifier: null,
  successStatuses(xhr) {
    return [200, 201, 202].includes(xhr.status)
    // return xhr.status === 200
  },
  retries: 3,
  retryInterval: 1000,
  merge: (file) => {
    file.path = 'http://baidu.com'
  }
}

const defaultAttributes = {
  multiple: true,
  accept: '*'
}
export default class Uploader extends Event {
  constructor(options) {
    super()
    this.opts = extend({}, defaultOptions, options)
    this.fileList = []
    this.uploadingQueue = []
    this.status = 'init'
  }

  addFiles(files) {
    this.status = 'hahah'

    const newFileList = [...files].map((file) => {
      return new File(this, file)
    })
    this.status = Status.Ready
    this.fileList = [...this.fileList, ...newFileList]
    this.emit('filesAdded', this.fileList)
    if (this.opts.autoUpload) {
      this.upload()
    }
  }

  async uploadPool() {
    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i]
      const chunkPromises = []
      for (let j = 0; j < file.chunks.length; j++) {
        const chunk = file.chunks[j]
        chunkPromises.push(chunk)
      }
      try {
        await pool(chunkPromises, this.opts.concurrency)
        file.status = Status.Success
        file.progress = 1
      } catch (e) {
        console.log(e)
        file.status = Status.Fail
      }
    }
  }

  async upload() {
    const hasUploadingFile = this.fileList.some((file) => file.status === Status.Uploading)
    if (hasUploadingFile) {
      return
    }
    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i]
      if (file.status === Status.Ready) {
        file.uploadFile()
        return
      }
    }
    const hasFail = this.fileList.some((file) => file.status === Status.Fail)
    if (hasFail) {
      // this.emit('allSuccess', this.fileList)
    } else {
      this.emit('allSuccess', this.fileList)
    }
  }

  submit() {
    this.upload()
  }

  _findFileById(id) {
    let fileInfo
    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i]
      if (id === file.id) {
        fileInfo = {
          file: file,
          index: i
        }
        return fileInfo
      }
    }
  }

  remove(id) {
    if (!id) {
      this.fileList.forEach((file) => {
        file.remove()
      })
      return
    }
    const { file, index } = this._findFileById(id)
    file.remove()
    this.fileList.splice(index, 1)
    this.emit('fileRemove', file, this.fileList)
    this.upload()
  }

  retry(id) {
    const { file } = this._findFileById(id)
    file.retryUpload()
    this.upload()
  }

  pause(id) {
    if (!id) {
      return
    }
    const { file } = this._findFileById(id)
    file.pause()
  }

  resume(id) {
    if (!id) {
      return
    }
    const { file } = this._findFileById(id)
    file.status = Status.Ready
    file.resume()
  }

  assignBrowse(domNode, attributes) {
    let input
    attributes = extend({}, defaultAttributes, attributes)
    if (domNode.tagname === 'INPUT' && domNode.type === 'file') {
      input = domNode
    } else {
      input = document.createElement('input')
      input.setAttribute('type', 'file')

      extend(input.style, {
        visibility: 'hidden',
        position: 'absolute',
        width: '1px',
        height: '1px'
      })

      each(attributes, (val, key) => {
        input.setAttribute(key, val)
      })

      if (attributes.multiple) {
        input.setAttribute('multiple', 'multiple')
      }

      domNode.appendChild(input)
      domNode.addEventListener(
        'click',
        () => {
          input.click()
        },
        false
      )

      input.addEventListener(
        'change',
        (e) => {
          this.addFiles(e.target.files, e)
          e.target.value = ''
        },
        false
      )
    }
  }

  assignDrop(domNode) {
    const preventEvent = (e) => {
      e.preventDefault()
    }
    const handles = {
      dragover: preventEvent,
      dragenter: preventEvent,
      dragleave: preventEvent,
      drop: (e) => {
        e.stopPropagation()
        e.preventDefault()
        this.addFiles(e.dataTransfer.files, e)
      }
    }
    each(handles, (handler, name) => {
      domNode.addEventListener(name, handler, false)
    })
  }
}
