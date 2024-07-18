# uploader-sdk

## Quick Start

```vue
<template>
  <div>
    <div class="">
      <el-button id="uploadBtn" type="primary">Upload</el-button>
    </div>
    <div v-for="file in files" :key="file.id">
      <div style="overflow: hidden; text-overflow: ellipsis;">
        {{ file.name }}
      </div>
      <div style="display: flex; align-items: center;">
        <el-progress :percentage="+(file.progress * 100).toFixed(2)" style="flex: 1;" />
        <div style="width: 44px;">
          <el-icon v-if="file.status === Status.Fail" @click="retry(file.id)" class="action">
            <RefreshRight color="#409EFF" />
          </el-icon>
          <el-icon v-if="file.status === Status.Pause" @click="resume(file.id)" class="action">
            <VideoPlay color="#409EFF" />
          </el-icon>
          <el-icon v-if="file.status === Status.Uploading" @click="pause(file.id)" class="action">
            <VideoPause color="#E6A23C" />
          </el-icon>
          <el-icon @click="remove(file.id)" class="action">
            <Close />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RefreshRight, VideoPlay, VideoPause, Close } from '@element-plus/icons-vue'
import Uploader from '@tinyUploader/sdk'
const Status = Uploader.Status
const Events = Uploader.Events

const uploader = ref(null)
const files = ref([])
const merge = (file) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      file.path = 'http://baidu.com'
    }, 1000)
  })
}

onMounted(() => {
  uploader.value = new Uploader({
    merge
  })
  uploader.value.assignBrowse(document.getElementById('uploadBtn'))

  uploader.value.on(Events.FilesAdded, (fileList) => {
    files.value = fileList
  })

  uploader.value.on(Events.AllFileSuccess, (fileList) => {
    console.log('全部上传成功', fileList)
    files.value = fileList
  })

  uploader.value.on(Events.FileUploadSuccess, (file, fileList) => {
    console.log(`${file.name}上传成功`, file, fileList)
    files.value = fileList
  })

  uploader.value.on(Events.FileFail, (file, fileList) => {
    console.log(`${file.name}上传失败`, file, fileList)
    files.value = fileList
  })

  uploader.value.on(Events.FileMergeFail, (file, fileList) => {
    console.log(`${file.name}合并失败`, file, fileList)
    files.value = fileList
  })

  uploader.value.on(Events.FileSuccess, (file, fileList) => {
    console.log(`${file.name}合并成功，并且可拿到merge中file的url`, file, fileList)
    files.value = fileList
  })

  uploader.value.on(Events.FileRemove, (file, fileList) => {
    console.log(`${file.name}被删除`, file, fileList)
    files.value = fileList
  })

  uploader.value.on(Events.FileProgress, (progress, file, fileList) => {
    console.log(`${file.name} progress ${progress}`, file, fileList)
  })
})

const remove = (id) => {
  uploader.value.remove(id)
}

const retry = (id) => {
  uploader.value.retry(id)
}

const resume = (id) => {
  uploader.value.resume(id)
}

const pause = (id) => {
  uploader.value.pause(id)
}
</script>
```

## 接口

### assignBrowse 参数

| 参数     | 说明                 | 默认值 | 类型    |
| -------- | -------------------- | ------ | ------- |
| multiple | 是否支持选择多个文件 | true   | boolean |
| accept   | 上传文件类型         | \*     | string  |
|          |                      |        |         |

### options 参数

| 参数                     | 说明                         | 默认值                                                                                       | 类型                      |
| ------------------------ | ---------------------------- | -------------------------------------------------------------------------------------------- | ------------------------- |
| target                   | 上传 url                     | <https://jsonplaceholder.typicode.com/posts，用来测试>                                       | String                    |
| withCredentials          | 携带 cookie                  |                                                                                              | Boolean                   |
| headers                  | 请求头                       |                                                                                              | Object                    |
| data                     | 其他参数                     |                                                                                              | Object                    |
| concurrency              | 并发大小                     | 6                                                                                            | Number                    |
| chunkSize                | chunk 大小 kb                | 1024\*4，用来测试 demo                                                                       | Number                    |
| autoUpload               |                              | true                                                                                         | Boolean                   |
| name                     | 上传时后端需要的文件名称     | file                                                                                         | String                    |
| generateUniqueIdentifier | 自定义文件 id                | null                                                                                         | Null 或者 function        |
| successStatuses          | 上传成功条件,参数是 xhr 对象 | (xhr) => {<br />return [200, 201, 202].includes(xhr.status)<br />}                           | function                  |
| retries                  | 重试次数                     | 3                                                                                            | Number                    |
| retryInterval            | 重试间隔 ms                  | 1000                                                                                         | Number                    |
| merge                    | 合并回调，参数是 file 实例   | merge: (file) => { <br /> await sleep(5000) ; <br /> file.path = '<http://baidu.com>'<br />} | functioin/promise/Boolean |
|                          |                              |                                                                                              |                           |

### 方法

| 名称   | 说明                                            | 默认值 | 类型 |
| ------ | ----------------------------------------------- | ------ | ---- |
| remove | 删除某个文件，参数是文件 id，没有 id 时删除全部 |        |      |
| retry  | 上传失败时重试，参数是文件 id                   |        |      |
| pause  | 暂停上传，参数是文件 id                         |        |      |
| resume | 重新上传，参数是文件 id                         |        |      |
|        |                                                 |        |      |
|        |                                                 |        |      |
|        |                                                 |        |      |

### 常量

```
Uploader.Status = {
  Ready: 'ready',
  Pending: 'pending',
  Uploading: 'uploading',
  UploadSuccess: 'uploadSuccess',
  Success: 'success',
  Fail: 'fail',
  Pause: 'pause',
  Resume: 'resume'
}

Uploader.Events = {
  FilesAdded: 'filesAdded',
  FileRemove: 'fileRemove',
  FileProgress: 'fileProgress',
  FileFail: 'fileFail',
  FileUploadSuccess: 'fileUploadSuccess',
  FileSuccess: 'fileSuccess',
  FileMergeFail: 'fileMergeFail',
  AllFileSuccess: 'allFilesSuccess'
}
```

### 回调

| 名称                              | 说明                                                                 | 默认值 | 类型 |
| --------------------------------- | -------------------------------------------------------------------- | ------ | ---- |
| Uploader.Events.FilesAdded        | 回调参数 fileList                                                    |        |      |
| Uploader.Events.FileRemove        | 回调参数 file, fileList                                              |        |      |
| Uploader.Events.FileProgress      | 回调参数 progress， file，fileList                                   |        |      |
| Uploader.Events.FileFail          | 回调参数 file, fileList, 上传过程中失败                              |        |      |
| Uploader.Events.FileUploadSuccess | 回调参数 file, fileList, 文件上传成功，但是还未进行 merge 操作       |        |      |
| Uploader.Events.FileSuccess       | 回调参数 file, fileList, 文件上传成功，merge 成功                    |        |      |
| Uploader.Events.FileMergeFail     | 回调参数 file, fileList, 文件上传成功，merge 失败，可尝试 retry 操作 |        |      |
| Uploader.Events.AllFileSuccess    | 回调参数 fileList                                                    |        |      |
