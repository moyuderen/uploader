import extend from './shared/extend.js'
import each from './shared/each.js'
import { pool } from './shared/pool.js'
import { Status } from './shared/Status.js'
import File from './File.js'

const defaultOptions = {
  target: 'https://jsonplaceholder.typicode.com/posts',
  withCredentials: true,
  headers: {
    name: 'hah'
  },
  data: {},
  concurrency: 5,
  chunkSize: 1 * 1024 * 4,
  autoUpload: true
}

const defaultAttributes = {
  multiple: true,
  accept: '*'
}

export default class Uploader {
  constructor(options) {
    this.opts = extend({}, defaultOptions, options)
    this.fileList = []
    this.uploadingQueue = []
    this.status = 'init'
  }

  addFiles(files) {
    this.status = Status.Pending

    const newFileList = [...files].map((file) => {
      return new File(this, file)
    })
    this.status = Status.Ready
    this.fileList = [...this.fileList, ...newFileList]
    if (this.opts.autoUpload) {
      this.upload1()
    }
  }

  async upload() {
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

  async upload1() {
    const hasUploadingFile = this.fileList.some((file) => file.status === Status.Uploading)
    if (hasUploadingFile) {
      return
    }
    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i]
      if (file.status === Status.Ready) {
        file.send()
        return
      }
    }
  }

  submit() {
    this.upload()
  }

  remove(id) {
    let delteFile
    let index = -1
    this.fileList.forEach((file, i) => {
      if (file.id === id) {
        delteFile = file
        index = i
      }
    })

    delteFile.remove()
    this.fileList.splice(index, 1)
    this.upload1()
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
