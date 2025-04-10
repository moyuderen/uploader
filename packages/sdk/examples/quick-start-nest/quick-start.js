const { createApp, ref, onMounted } = Vue

// dist
// import { create, FileStatus, ChunkStatus, CheckStatus, Callbacks } from '../dist/sdk.mjs'

// dev
import { create, FileStatus, ChunkStatus, CheckStatus, Callbacks } from '../../src/index.js'
import { requestSucceed, customRequest, checkRequest, mergeRequest } from './request.js'

createApp({
  setup() {
    const uploader = ref(null)
    const files = ref([])

    onMounted(() => {
      uploader.value.assignBrowse(document.querySelector('.uploader-btn'))
      uploader.value.assignBrowse(document.querySelector('.uploader-drag'))
      uploader.value.assignDrop(document.querySelector('.uploader-drag'))
    })

    uploader.value = create({
      limit: 5,
      customRequest,
      requestSucceed,
      checkRequest,
      mergeRequest
    })

    uploader.value.on(Callbacks.Exceed, (file, fileList) => {
      console.log(`Exceed ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileChange, (file, fileList) => {
      console.log(`FileChange ---- ${file.name} ---- ${file.status}`)
      files.value = fileList
    })

    uploader.value.on(Callbacks.FileAdded, (file, fileList) => {
      console.log(`FileAdded ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FilesAdded, (fileList) => {
      console.log(`FilesAdded ----`, fileList)
    })

    uploader.value.on(Callbacks.FileReadStart, (file, fileList) => {
      console.log(`FileReadStart ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileReadProgress, (file, fileList) => {
      console.log(`FileReadProgress ---- ${file.name} ---- ${file.status}---- ${file.readProgress}`)
    })

    uploader.value.on(Callbacks.FileReadEnd, (file, fileList) => {
      console.log(`FileReadEnd ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileRemove, (file, fileList) => {
      console.log(`FileRemove ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileProgress, (file, fileList) => {
      console.log(`FileProgress ---- ${file.name} ---- ${file.status}---- ${file.progress}`)
    })

    uploader.value.on(Callbacks.FileFail, (file, fileList) => {
      console.log(`FileFail ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileUploadFail, (file, fileList) => {
      console.log(`FileUploadFail ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileUploadSuccess, (file, fileList) => {
      console.log(`FileUploadSuccess ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileSuccess, (file, fileList) => {
      console.log(`FileSuccess ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FilePause, (file, fileList) => {
      console.log(`FilePause ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileResume, (file, fileList) => {
      console.log(`FileResume ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.AllFileSuccess, (fileList) => {
      console.log(`AllFileSuccess ---- `, fileList)
    })

    uploader.value.setDefaultFileList([
      {
        id: '1',
        name: 'baidu.png',
        url: 'http://baidu.com'
      },
      {
        id: '2',
        name: 'google.png',
        url: 'http://google.com'
      }
    ])

    const submit = () => {
      uploader.value.submit()
    }

    const clear = () => {
      uploader.value.clear()
    }

    const remove = (file) => {
      uploader.value.remove(file)
    }

    const pause = (file) => {
      uploader.value.pause(file)
    }

    const resume = (file) => {
      uploader.value.resume(file)
    }

    const retry = (file) => {
      uploader.value.retry(file)
    }

    return {
      FileStatus,
      files,
      submit,
      clear,
      remove,
      pause,
      resume,
      retry
    }
  }
}).mount('#app')
