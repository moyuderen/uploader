import { Event, extend, each } from 'tiny-uploader-utils'
import File from './File.js'
import defaults from './defaults.js'
import { Status } from './constans.js'

class Uploader extends Event {
  constructor(options) {
    super()

    this.opts = extend({}, defaults.options, options)
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

  async upload(pauseAllFile) {
    if (pauseAllFile) {
      const uploadingFiles = this.fileList.filter((file) => file.status === Status.Uploading)
      uploadingFiles.forEach((file) => {
        file.pause()
      })
    }

    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i]
      if (file.status === Status.Uploading) {
        return
      }
      if (file.status === Status.Resume) {
        file.status === Status.Uploading
        file.uploadFile()
        return
      }
      if (file.status === Status.Ready) {
        file.uploadFile()
        return
      }
    }
    const allSuccess = this.fileList.every((file) => file.status === Status.Success)
    if (allSuccess) {
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
    file.pauseThenUpload()
  }

  resume(id) {
    if (!id) {
      return
    }
    const { file } = this._findFileById(id)
    file.resume()
  }

  assignBrowse(domNode, attributes) {
    let input
    attributes = extend({}, defaults.attributes, attributes)
    if (domNode.tagName === 'INPUT' && domNode.type === 'file') {
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

Uploader.Status = Status
Uploader.create = (options) => {
  return new Uploader(options)
}

export default Uploader
