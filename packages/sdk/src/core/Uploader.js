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
    this.listenerFiles()
  }

  assignBrowse(domNode, attributes) {
    if (attributes) {
      const { accept } = attributes
      if (accept) {
        if (isString(accept)) {
          attributes.accept = accept
        } else if (isArray(accept)) {
          attributes.accept = accept.join(',')
        }
      }
      extend(
        {
          multiple: this.options.multiple,
          accept: this.options.accept
        },
        attributes
      )
    } else {
      attributes = {
        multiple: this.options.multiple,
        accept: this.options.accept
      }
    }

    this.container.assignBrowse(domNode, attributes)
  }

  assignDrop(domNode) {
    this.container.assignDrop(domNode)
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

  listenerFiles() {
    const emitAllSuccess = (file, fileList) => {
      if (!fileList.length) {
        return
      }
      const allSuccess = fileList.every((file) => file.isSuccess())
      if (allSuccess) {
        this.emit(Callbacks.AllFileSuccess, this.fileList)
      }
    }

    this.on(Callbacks.FileSuccess, emitAllSuccess)
    this.on(Callbacks.FileRemove, emitAllSuccess)
  }

  setDefaultFileList(fileList) {
    fileList.forEach((file) => {
      this.fileList.push(
        new File(
          {
            ...file,
            name: file.name,
            readProgress: 1,
            progress: 1,
            status: FileStatus.Success
          },
          this
        )
      )
    })
  }

  async addFiles(arrayLike, e) {
    const { limit, beforeAdd } = this.options
    const originFiles = [...arrayLike]

    if (limit > 0) {
      if (originFiles.length + this.fileList.length > limit) {
        this.emitCallback(Callbacks.Exceed, originFiles)
        return
      }
    }

    if (originFiles.length === 0) {
      return
    }

    if (!this.options.multiple) {
      originFiles = originFiles.slice(0, 1)
    }

    let newFileList = originFiles.map((file) => new File(file, this))

    const fileAdd = (file) => {
      this.fileList.push(file)
      this.emitCallback(Callbacks.FileAdded, file)
    }

    const fileRemove = (file) => {
      newFileList = newFileList.filter((item) => item.uid !== file.uid)
      this.emitCallback(Callbacks.FileRemove, file)
    }

    const fileAddFail = (file) => {
      if (this.options.addFailToRemove) {
        this.emitCallback(Callbacks.FileAddFail, file)
        fileRemove(file)
      } else {
        this.fileList.push(file)
        file.changeStatus(FileStatus.AddFail)
        this.emitCallback(Callbacks.FileAddFail, file)
      }
    }

    const handleBefore = async (file) => {
      if (beforeAdd && isFunction(beforeAdd)) {
        const before = beforeAdd(file)
        if (isPromise(before)) {
          try {
            await before
            fileAdd(file)
          } catch (e) {
            fileAddFail(file)
          }
        } else {
          if (before !== false) {
            fileAdd(file)
          } else {
            fileAddFail(file)
          }
        }
      } else {
        fileAdd(file)
      }
    }

    await Promise.all(newFileList.map((file) => handleBefore(file)))

    if (newFileList.length > 0) {
      this.emitCallback(Callbacks.FilesAdded, this.fileList)
    }

    if (this.options.autoUpload) {
      this.submit()
    }
  }

  async upload() {
    if (this.fileList.length === 0) return

    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i]
      if (file.isAddFail()) {
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
