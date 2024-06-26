# upload-sdk

## 功能

- [ ] 单文件上传，不分片

- [x] 分片上传

- [ ] 参数配置

  - [ ] 文件大小

  - [ ] 文件类型

  - [ ] 上传文件个数

  - [x] 是否支持多文件

  - [x] 上传时携带cookie

  - [x] 自定义上传data和headers

  - [x] 并发数

  - [x] 重试次数

  - [x] 重试间隔

  - [x] 成功回调

  - [x] 失败回调

  - [x] 自定义文件的hash算法

- [ ] 是否使用spark计算hash
- [ ] spark计算优化--web worker
- [x] 进度展示，比例和上传大小
- [x] 状态展示（file，chunk）
- [x] 并发处理
- [ ] 秒传，断点续传
- [x] 暂停，继续上传
- [x] 取消上传文件&&删除文件（取消上传）
- [x] 点击暂停会取消并清空切片的 xhr 请求，此时如果已经上传了一部分，就会发现文件进度条有倒退的现象
- [x] 报错，重试
- [x] 修改上传文件的优先级，点击当前文件时开始上传，暂停其他文件

## Quick Start

```vue
<template>
  <div>
    <div class="">
      <el-button id="uploadBtn" type="primary">Upload</el-button>
      <el-button type="primary" @click="getUploader">get uploader</el-button>
      <el-button type="primary" @click="submit">Submit</el-button>
    </div>
    <div v-for="(file) in files" :key="file.id">
      <div style="overflow: hidden; text-overflow: ellipsis;">
        {{ file.name }}
      </div>
      <div style="display: flex; align-items: center;">
        <el-progress :percentage="+(file.progress * 100).toFixed(2)" :status="PROGRESS[file.status]" style="flex: 1;" />
        <div style="width: 44px;">
          <el-icon v-if="file.status === 'fail'" @click="retry(file.id)" class="action">
            <RefreshRight color="#409EFF" />
          </el-icon>
          <el-icon v-if="file.status === 'pause'" @click="resume(file.id)" class="action">
            <VideoPlay color="#409EFF" />
          </el-icon>
          <el-icon v-if="file.status === 'uploading'" @click="pause(file.id)" class="action">
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
import { onMounted, ref } from "vue";
import { RefreshRight, VideoPlay, VideoPause, Close } from '@element-plus/icons-vue'
import Uploader from "@/sdk";
const Status = Uploader.Status

const PROGRESS = {
  [Status.Success]: 'success',
  [Status.Fail]: 'exception',
}
const uploader = ref(null)
const files = ref([])

onMounted(() => {
  uploader.value = new Uploader({
    // autoUpload: false
  })
  uploader.value.assignBrowse(document.getElementById('uploadBtn'))
  uploader.value.on('filesAdded', (fileList) => {
    files.value = fileList
  })

  uploader.value.on('allSuccess', (fileList) => {
    console.log('全部上传成功', fileList)
    files.value = fileList
  })

  uploader.value.on('fileSuccess', (file, fileList) => {
    console.log(`${file.name}上传成功`, file, fileList)
    files.value = fileList
  })

  uploader.value.on('fileFail', (file, fileList) => {
    console.log(`${file.name}上传失败`, file, fileList)
    files.value = fileList
  })

  uploader.value.on('fileRemove', (file, fileList) => {
    console.log(`${file.name}被删除`, file, fileList)
    files.value = fileList
  })

  uploader.value.on('fileProgress', (progress, file, fileList) => {
    // console.log(`${file.name} progress ${progress}`, file, fileList)
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

const getUploader = () => {
  console.log(uploader)
  const fileList = uploader.value.fileList
  const list = fileList.map(file => {
    return {
      name: file.name,
      chunks: file.chunks,
      errorChunks: file.chunks.filter(chunk => chunk.status === Status.Fail),
      successChunks: file.chunks.filter(chunk => chunk.status === Status.Success),
      readyChunks: file.chunks.filter(chunk => chunk.status === Status.Ready),
      pendingChunks: file.chunks.filter(chunk => chunk.status === Status.Pending)
    }
  })

  console.log(list)
}

const submit = () => {
  uploader.value.submit()
}

</script>

<style scoped>
.action {
  margin-left: 6px;
}
</style>

```



## 接口

###  assignBrowse参数

| 参数     | 说明                 | 默认值 | 类型    |
| -------- | -------------------- | ------ | ------- |
| multiple | 是否支持选择多个文件 | true   | boolean |
| accept   | 上传文件类型         | *      | string  |
|          |                      |        |         |

### options参数

| 参数                     | 说明                       | 默认值                                                       | 类型                  |
| ------------------------ | -------------------------- | ------------------------------------------------------------ | --------------------- |
| target                   | 上传url                    |                                                              |                       |
| withCredentials          | 携带cookie                 |                                                              |                       |
| headers                  | 请求头                     |                                                              |                       |
| data                     | 其他参数                   |                                                              |                       |
| concurrency              | 并发大小                   | 6                                                            |                       |
| chunkSize                | chunk大小kb                | 1024*4                                                       |                       |
| autoUpload               |                            | true                                                         |                       |
| name                     |                            | file                                                         |                       |
| generateUniqueIdentifier | 自定义文件id               | null                                                         | Null 或者 function    |
| successStatuses          | 上传成功条件,参数是xhr对象 | (xhr) => {<br />return [200, 201, 202].includes(xhr.status)<br />} | function              |
| retries                  | 重试次数                   | 3                                                            |                       |
| retryInterval            | 重试间隔ms                 | 1000                                                         |                       |
| merge                    |                            |                                                              | functioin 或者promise |
|                          |                            |                                                              |                       |



### 方法

| 名称   | 说明                                         | 默认值 | 类型 |
| ------ | -------------------------------------------- | ------ | ---- |
| remove | 删除某个文件，参数是文件id，没有id时删除全部 |        |      |
| retry  | 上传失败时重试，参数是文件id                 |        |      |
| pause  | 暂停上传，参数是文件id                       |        |      |
| resume | 重新上传，参数是文件id                       |        |      |
|        |                                              |        |      |
|        |                                              |        |      |
|        |                                              |        |      |



### 回调

| 名称         | 说明                                   | 默认值 | 类型 |
| ------------ | -------------------------------------- | ------ | ---- |
| allSuccess   | 全部成功                               |        |      |
| fileSuccess  | 文件上传成功，参数是file, fileList     |        |      |
| fileFail     | 文件上传失败，参数是file, fileList     |        |      |
| fileRemove   | 文件删除，参数是file, fileList         |        |      |
| fileProgress | 文件上传进度，progress, file, fileList |        |      |
|              |                                        |        |      |
|              |                                        |        |      |



## 参考

> <https://github.dev/axios/axios>
>
> <https://github.dev/simple-uploader/Uploader>
>
> <https://github.dev/simple-uploader/vue-uploader>
