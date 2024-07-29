const { createApp, ref, onMounted } = Vue

// import Uploader from '../dist/sdk.mjs'
import Uploader from '../src'
const File = Uploader.File
const Status = Uploader.Status
const Events = Uploader.Events

createApp({
  setup() {
    const defaultFileList = [
      new File({
        path: 'http://baidu.com',
        name: 'haha',
        status: Status.Success,
        progress: 1
      })
    ]
    const uploader = ref(null)
    const files = ref(defaultFileList)

    uploader.value = new Uploader({
      action: 'https://jsonplaceholder.typicode.com/posts',
      fileList: defaultFileList,
      chunkSize: 1024 * 1024 * 10, // 10M,
      maxRetries: 1
    })

    onMounted(() => {
      uploader.value.assignBrowse(document.querySelector('.uploader-btn'))
    })

    const pause = (file) => {
      uploader.value.pause(file)
    }

    const resume = (file) => {
      uploader.value.resume(file)
    }

    const retry = (file) => {
      uploader.value.retry(file)
    }

    const remove = (file) => {
      uploader.value.remove(file)
    }

    const clear = () => {
      uploader.value.clear()
    }

    uploader.value.on(Events.FilesAdded, (fileList) => {
      files.value = fileList
    })

    uploader.value.on(Events.FileProgress, (progress, file, fileList) => {
      console.log(`${file.name}: 上传进度${(progress * 100).toFixed(2)}`)
      files.value = fileList
    })

    uploader.value.on(Events.FileUploadFail, (file, fileList) => {
      console.log(`${file.name}: 分片上传失败`)
      files.value = fileList
    })

    uploader.value.on(Events.FileFail, (file, fileList) => {
      console.log(`${file.name}: merge失败`)
      files.value = fileList
    })

    uploader.value.on(Events.FileUploadSuccess, (file, fileList) => {
      console.log(`${file.name}: 分片上传成功，准备merge`)
      files.value = fileList
    })

    uploader.value.on(Events.FileSuccess, (file, fileList) => {
      console.log(`${file.name}: 上传且合并成功`)
      files.value = fileList
    })

    uploader.value.on(Events.FileRemove, (file, fileList) => {
      console.log(`${file.name}: 被删除了`)
      files.value = fileList
    })

    uploader.value.on(Events.AllFileSuccess, (fileList) => {
      console.log(`全部上传成功`, fileList)
      files.value = fileList
    })

    return {
      Status,
      uploader,
      files,
      pause,
      resume,
      retry,
      remove,
      clear
    }
  }
}).mount('#app')
