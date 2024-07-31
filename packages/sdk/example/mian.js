const { createApp, ref, onMounted } = Vue

import { create, Status, Events, CheckStatus } from '../dist/sdk.mjs'
// import { create, Status, Events, CheckStatus } from '../src'

createApp({
  setup() {
    const defaultFileList = [{ path: 'http://baidu.com', name: 'haha' }]
    const uploader = ref(null)
    const files = ref([])

    uploader.value = create({
      action: 'http://localhost:3000/upload',
      fileList: defaultFileList,
      chunkSize: 1024 * 1024 * 10, // 10M,
      // chunkSize: 1024 * 3, // 3k,
      maxRetries: 0,
      withCredentials: true,
      async mergeRequest(file) {
        const { hash, name } = file
        const { data } = await axios.post('http://localhost:3000/merge', { name, hash })
        file.path = data.data
      },
      async checkFileRequest(file) {
        const { data } = await axios.post('http://localhost:3000/checkFile', {
          // status: CheckStatus.Success
          status: CheckStatus.Part
          // status: CheckStatus.None
        })
        return data
      }
    })
    files.value = uploader.value.fileList

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
