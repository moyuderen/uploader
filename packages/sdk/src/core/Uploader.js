import { Event, extend, each } from '@/shared'
import File from './File.js'
import defaults from './defaults.js'
import { Status, Events } from './constans.js'

class Uploader extends Event {
  constructor(options) {
    super()

    this.opts = extend({}, defaults.options, options)
    this.fileList = this.opts.fileList || []
    this.status = Status.Init
  }

  async addFiles(files) {
    const originFiles = [...files]

    if (originFiles.length + this.fileList.length > this.opts.limit) {
      this.emit(Events.Exceed)
      return
    }

    const newFileList = originFiles.map((file) => new File(this, file))

    this.status = Status.Ready
    this.fileList = [...this.fileList, ...newFileList]
    this.emit(Events.FilesAdded, this.fileList)

    await Promise.all(newFileList.map((file) => file.bootstrap()))

    if (this.opts.autoUpload) {
      this.upload()
    }
  }

  pauseUploadingFiles() {
    const uploadingFiles = this.fileList.filter((file) => file.status === Status.Uploading)
    uploadingFiles.forEach((file) => {
      file.pause()
    })
  }

  async upload() {
    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i]
      if (file.status === Status.Uploading) {
        return
      }
      if (file.status === Status.Resume) {
        file.status = Status.Uploading
        file.uploadFile()
        return
      }
      if (file.status === Status.Ready) {
        file.uploadFile()
        return
      }
    }
    // every 在数组为空时会返回true
    if (this.fileList.length) {
      const allSuccess = this.fileList.every((file) => file.isSuccess())
      if (allSuccess) {
        this.emit(Events.AllFileSuccess, this.fileList)
      }
    }
  }

  submit() {
    this.upload()
  }

  remove(file) {
    if (!file) {
      this.clear()
      return
    }
    const index = this.fileList.indexOf(file)
    if (index > -1) {
      file.remove()
      this.fileList.splice(index, 1)
      this.emit(Events.FileRemove, file, this.fileList)
      this.upload()
    }
  }

  retry(file) {
    if (index > -1) {
      file.retryUpload()
      this.upload()
    }
  }

  pause(file) {
    const index = this.fileList.indexOf(file)
    if (index > -1) {
      file.pause()
    }
  }

  resume(file) {
    const index = this.fileList.indexOf(file)
    if (index > -1) {
      file.resume()
    }
  }

  clear() {
    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i]
      file.remove()
      this.emit(Events.FileRemove, file, this.fileList)
    }
    this.fileList = []
    this.emit(Events.FileRemove, null, [])
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
      } else {
        input.removeAttribute('multiple')
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
Uploader.Events = Events
Uploader.File = File
Uploader.create = (options) => {
  return new Uploader(options)
}

export default Uploader
