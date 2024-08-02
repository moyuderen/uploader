import File from '@/core/File'
import Container from '@/core/Container'
import { Event, extend, isFunction, isPromise } from '@/shared'
import { defaults } from '@/core/defaults'
import { Status, Events, CheckStatus } from '@/core/constans'

class Uploader {
  constructor(options) {
    this.container = new Container(this)
    this.event = new Event()
    this.opts = extend({}, defaults, options)
    let fileList = []
    if (this.opts.fileList && this.opts.fileList.length) {
      fileList = this.opts.fileList.map(
        (item) =>
          new File({
            name: item.name,
            path: item.path,
            status: Status.Success,
            progress: 1
          })
      )
    }
    this.fileList = fileList
    this.status = Status.Init
    // 只注册一次
    this.listenerFiles()
  }

  on(name, func) {
    this.event.on(name, func)
  }

  emit(name, ...args) {
    this.event.emit(name, ...args)
  }

  async addFiles(files) {
    const { limit, beforeAdd, attributes } = this.opts

    if (limit > 0) {
      if (files.length + this.fileList.length > limit) {
        this.emit(Events.Exceed, files, this.fileList)
        return
      }
    }

    let originFileList = [...files]

    if (!this.opts.multiple) {
      originFileList = originFileList.slice(0, 1)
    }

    if (originFileList.length === 0) {
      return
    }

    const newFileList = originFileList.map((file) => new File(file, this))
    this.fileList = [...this.fileList, ...newFileList]

    if (beforeAdd) {
      if (isFunction(beforeAdd)) {
        for (let i = 0; i < newFileList.length; i++) {
          const file = newFileList[i]
          const before = beforeAdd(file)
          if (isPromise(before)) {
            before.then(
              () => {},
              () => {
                this.doRemove(file)
              }
            )
          } else if (before !== false) {
            //
          } else {
            this.doRemove(file)
          }
        }
      }
    }

    this.emit(Events.FilesAdded, this.fileList)
    this.status = Status.Ready

    if (this.opts.autoUpload) {
      this.submit()
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
  }

  async submit() {
    const initedFileList = this.fileList.filter((file) => file.isInited())
    // 第一个file ready之后就开始上传，避免多个ready状态的file同时上传
    try {
      await Promise.race(initedFileList.map((file) => file.start()))
    } catch (e) {
      console.log(e)
    }
    this.upload()
  }

  listenerFiles() {
    const emitAllSuccess = (fiel, fileList) => {
      if (!fileList.length) {
        return
      }
      const allSuccess = fileList.every((file) => file.isSuccess())
      if (allSuccess) {
        this.emit(Events.AllFileSuccess, this.fileList)
        this.status = Status.Success
      }
    }

    this.on(Events.FileSuccess, emitAllSuccess)
    this.on(Events.FileRemove, emitAllSuccess)
  }

  doRemove(file) {
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

  clear() {
    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i]
      file.remove()
      this.emit(Events.FileRemove, file, this.fileList)
    }
    this.fileList = []
    this.emit(Events.FileRemove, null, [])
  }

  remove(file) {
    const { beforeRemove } = this.opts
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

  retry(file) {
    const index = this.fileList.indexOf(file)
    if (index > -1) {
      file.retry()
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

  assignBrowse(domNode, attributes = {}) {
    const attrs = extend(
      {},
      {
        accept: this.opts.accept,
        multiple: this.opts.multiple
      },
      attributes
    )
    this.container.assignBrowse(domNode, attrs)
  }

  assignDrop(domNode) {
    this.container.assignDrop(domNode)
  }
}

Uploader.Status = Status
Uploader.Events = Events
Uploader.File = File
Uploader.CheckStatus = CheckStatus
Uploader.create = (options) => {
  return new Uploader(options)
}

export default Uploader
