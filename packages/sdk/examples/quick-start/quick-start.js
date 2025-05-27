const { createApp, ref, reactive, onMounted, watch } = Vue
// const { VideoPause, VideoPlay, RefreshRight, CircleClose } = ElementPlusIconsVue

// dist
// import { create, FileStatus, ChunkStatus, CheckStatus, Callbacks } from '../dist/sdk.mjs'

// dev
import { create, FileStatus, Callbacks, CheckStatus } from '../../src/index.js'
import { requestSucceed, customRequest, checkRequest, mergeRequest } from './api.js'

const app = createApp({
  setup() {
    const drawer = ref(false)
    const actionList = [
      'http://localhost:3000/file/upload',
      'https://jsonplaceholder.typicode.com/posts'
    ]
    const options = reactive({
      drag: true,
      // input相关
      accept: '*',
      multiple: true,
      // 文件相关
      limit: 10,
      autoUpload: true,
      addFailToRemove: true,
      chunkSize: 2,
      fakeProgress: true,
      withHash: true,
      useWebWoker: true,
      // 上传相关
      name: 'file',
      action: 'http://localhost:3000/file/upload',
      withCredentials: true,
      data: {
        bucket: 'test-public',
        filePath: 'files/test01/'
      },
      headers: {
        userauth: 'xxxxx-xxxx-xxxxx'
      },
      maxConcurrency: 6,
      maxRetries: 3,
      retryInterval: 1000
    })
    const uploader = ref(null)
    const files = ref([])

    onMounted(() => {
      uploader.value.assignBrowse(document.querySelector('.uploader-btn'))
      uploader.value.assignBrowse(document.querySelector('.uploader-drag'))
      uploader.value.assignDrop(document.querySelector('.uploader-drag'))
    })

    uploader.value = create({
      ...options,
      fileList: [
        {
          id: '3',
          name: 'default1.png',
          url: 'http://baidu.com'
        }
      ],
      chunkSize: options.chunkSize * 1024 * 1024,
      customRequest,
      requestSucceed,
      checkRequest,
      mergeRequest
    })

    uploader.value.on(Callbacks.Exceed, (file, _fileList) => {
      console.log(`Exceed ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileChange, (file, fileList) => {
      console.log(`FileChange ---- ${file.name} ---- ${file.status}`)
      files.value = fileList
    })

    uploader.value.on(Callbacks.FileAdded, (file, _fileList) => {
      console.log(`FileAdded ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FilesAdded, (fileList) => {
      console.log(`FilesAdded ----`, fileList)
    })

    uploader.value.on(Callbacks.FileReadStart, (file, _fileList) => {
      console.log(`FileReadStart ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileReadProgress, (file, _fileList) => {
      console.log(`FileReadProgress ---- ${file.name} ---- ${file.status}---- ${file.readProgress}`)
    })

    uploader.value.on(Callbacks.FileReadEnd, (file, _fileList) => {
      console.log(`FileReadEnd ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileRemove, (file, _fileList) => {
      console.log(`FileRemove ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileProgress, (file, _fileList) => {
      console.log(`FileProgress ---- ${file.name} ---- ${file.status}---- ${file.progress}`)
    })

    uploader.value.on(Callbacks.FileFail, (file, _fileList) => {
      console.log(`FileFail ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileUploadFail, (file, _fileList) => {
      console.log(`FileUploadFail ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileUploadSuccess, (file, _fileList) => {
      console.log(`FileUploadSuccess ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileSuccess, (file, _fileList) => {
      console.log(`FileSuccess ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FilePause, (file, _fileList) => {
      console.log(`FilePause ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.FileResume, (file, _fileList) => {
      console.log(`FileResume ---- ${file.name} ---- ${file.status}`)
    })

    uploader.value.on(Callbacks.AllFileSuccess, (fileList) => {
      console.log(`AllFileSuccess ---- `, fileList)
    })

    uploader.value.setDefaultFileList([
      {
        id: '1',
        name: 'default.png',
        url: 'http://baidu.com'
      }
    ])

    watch(
      () => options,
      () => {
        uploader.value.setOption({
          ...options,
          chunkSize: options.chunkSize * 1024 * 1024
        })
      },
      { deep: true }
    )

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
      CheckStatus,
      actionList,
      drawer,
      options,
      files,
      submit,
      clear,
      remove,
      pause,
      resume,
      retry
    }
  }
})
app.use(ElementPlus)
app.mount('#app')
