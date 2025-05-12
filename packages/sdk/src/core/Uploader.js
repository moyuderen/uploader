import Container from './Container'
import Event from './Event'
import File from './File'
import { defaultOptions } from './defaults'
import { Callbacks, FileStatus } from './constants'
import { extend, isString, isArray, isFunction, isPromise } from '../shared'

export default class Uploader {
  constructor(options) {
    this.container = new Container(this)
    this.event = new Event()

    this.options = extend(defaultOptions, options)
    this.fileList = this.options.fileList || []
    this._setupFileListeners()
  }

  on(name, fn) {
    this.event.on(name, fn)
  }

  emit(name, ...args) {
    this.event.emit(name, ...args)
  }

  emitCallback(name, ...args) {
    this.emit(name, ...args, this.fileList)
  }

  formatAccept(accept) {
    if (isString(accept)) return accept
    if (isArray(accept)) return accept.join(',')
    return ''
  }

  assignBrowse(domNode, userAttributes) {
    const { accept, ...attributes } = userAttributes
    const defaults = {
      multiple: this.options.multiple,
      accept: this.formatAccept(accept || this.options.accept)
    }
    this.container.assignBrowse(domNode, extend({}, defaults, attributes))
  }

  assignDrop(domNode) {
    this.container.assignDrop(domNode)
  }

  _setupFileListeners() {
    const checkAllSuccess = (file, fileList) => {
      if (!fileList.length) {
        return
      }
      const allSuccess = fileList.every((file) => file.isSuccess())
      if (allSuccess) {
        this.emit(Callbacks.AllFileSuccess, this.fileList)
      }
    }

    this.on(Callbacks.FileSuccess, checkAllSuccess)
    this.on(Callbacks.FileRemove, checkAllSuccess)
  }

  setDefaultFileList(fileList) {
    fileList.forEach((file) => {
      this.fileList.push(new File(file, this, file))
    })
  }

  async addFiles(arrayLike) {
    const { limit, multiple, addFailToRemove, beforeAdd, autoUpload } = this.options
    let originFiles = [...arrayLike]

    if (originFiles.length === 0) return

    if (limit > 0 && originFiles.length + this.fileList.length > limit) {
      this.emitCallback(Callbacks.Exceed, originFiles)
      return
    }

    if (!multiple) {
      originFiles = originFiles.slice(0, 1)
    }

    const newFileList = originFiles.map((file) => new File(file, this))
    await Promise.all(newFileList.map((file) => this._handleFileAdd(file), beforeAdd))

    this.fileList = this.fileList.filter((file) => {
      if (file.isAddFail() && addFailToRemove) {
        this.doRemove(file)
        return false
      }
      return true
    })

    if (newFileList.length > 0) {
      this.emitCallback(Callbacks.FilesAdded, this.fileList)
    }

    if (autoUpload) {
      this.submit()
    }
  }

  async _handleFileAdd(file, beforeAdd) {
    try {
      // 如果是函数则进行结果判断，否则认为校验通过
      if (isFunction(beforeAdd)) {
        const result = await beforeAdd(file)
        // 如果返回的是false则失败，如果不返回或者返回为其他值如true则认为成功
        if (result === false) {
          throw new Error('Before add rejected')
        }
      }
      this.emitCallback(Callbacks.FileAdded, file)
    } catch {
      file.changeStatus(FileStatus.AddFail)
      this.emitCallback(Callbacks.FileAddFail, file)
    }
    this.fileList.push(file)
  }

  async upload() {
    if (this.fileList.length === 0) return

    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i]
      if (file.isAddFail() || file.isCheckFail()) {
        continue
      }

      if (file.isUploading() || file.isReading()) {
        return
      }

      if (file.isResume()) {
        // console.log(file.prevStatusLastRecord)
        // [uploading, pause, resume]  回到pause之前的状态
        const prevStatus = file.prevStatusLastRecord[file.prevStatusLastRecord.length - 2]

        if (prevStatus) {
          file.changeStatus(prevStatus)
        }
        file.upload()
        return
      }

      if (file.isReady() || file.isInit()) {
        file.upload()
        return
      }
    }
  }

  submit() {
    this.upload()
  }

  remove(file) {
    const { beforeRemove } = this.options
    if (!beforeRemove) {
      this.doRemove(file)
    } else if (isFunction(beforeRemove)) {
      const before = beforeRemove(file)
      if (isPromise(before)) {
        before.then(() => {
          this.doRemove(file)
        })
      } else if (before !== false) {
        this.doRemove(file)
      }
    }
  }

  clear() {
    // 倒序删除
    for (let i = this.fileList.length - 1; i >= 0; i--) {
      const file = this.fileList[i]
      file.remove()
    }
    this.fileList = []
  }

  doRemove(file) {
    if (!file) {
      this.clear()
      return
    }

    file.remove()
  }

  pause(file) {
    if (!file) return
    const index = this.fileList.indexOf(file)
    if (index > -1) {
      file.pause()
    }
  }

  resume(file) {
    if (!file) return
    const uploadingFiles = this.fileList.filter((file) => {
      return file.isUploading() || file.isReading()
    })

    uploadingFiles.forEach((item) => {
      item.pause()
    })
    file.resume()
  }

  retry(file) {
    if (!file) return
    const uploadingFiles = this.fileList.filter((file) => {
      return file.isUploading() || file.isReading()
    })

    uploadingFiles.forEach((item) => {
      item.pause()
    })
    const index = this.fileList.indexOf(file)
    if (index > -1) {
      file.retry()
    }
  }
}
