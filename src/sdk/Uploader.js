import File from './File.js'
import Event from './event.js'
import utils from './utils.js'
import defaults from './defaults.js'
import { Status } from './constans.js'

class Uploader extends Event {
  constructor(options) {
    super()

    this.opts = utils.extend({}, defaults.options, options)
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
    attributes = utils.extend({}, defaults.attributes, attributes)
    if (domNode.tagname === 'INPUT' && domNode.type === 'file') {
      input = domNode
    } else {
      input = document.createElement('input')
      input.setAttribute('type', 'file')

      utils.extend(input.style, {
        visibility: 'hidden',
        position: 'absolute',
        width: '1px',
        height: '1px'
      })

      utils.each(attributes, (val, key) => {
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
    utils.each(handles, (handler, name) => {
      domNode.addEventListener(name, handler, false)
    })
  }
}

Uploader.Status = Status
Uploader.create = (options) => {
  return new Uploader(options)
}

export default Uploader
