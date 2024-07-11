# uploader-vue

## Quick Start

```vue
<template>
  <div id="app">
    <Uploader
      ref="uploaderRef"
      :chunkSize="1024 * 1024 * 10"
      @onFilesAdded="onFilesAdded"
      @onFileRemove="onFileRemove"
      @onFileProgress="onFileProgress"
      @onFileFail="onFileFail"
      @onFileUploadSuccess="onFileUploadSuccess"
      @onFileSuccess="onFileSuccess"
      @onFileMergeFail="onFileMergeFail"
      @onAllFileSuccess="onAllFileSuccess"
      :merge="merge"
    />
    <button @click="abort">取消所有上传</button>
    <button @click="submit">Submit</button>
  </div>
</template>

<script>
export default {
  methods: {
    onFilesAdded(fileList) {
      console.log('添加文件成功', fileList)
    },
    onFileRemove(file, fileList) {
      console.log('删除文件成功', file, fileList)
    },
    onFileProgress(p, file, fileList) {
      // console.log('上传中', p, file, fileList)
    },
    onFileFail(file, fileList) {
      console.log('上传失败', file, fileList)
    },
    onFileUploadSuccess(file, fileList) {
      console.log('上传成功，准备合并', file, fileList)
    },
    onFileSuccess(file, fileList) {
      console.log('合并成功', file, fileList)
    },
    onFileMergeFail(file, fileList) {
      console.log('合并文件失败', file, fileList)
    },
    onAllFileSuccess(fileList) {
      console.log('全部上传成功', fileList)
    },
    async merge(file) {
      const sleep = () => {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            clearTimeout(timer)
            resolve({ url: 'https://google.com' })
          }, 1000)
        })
      }
      const { url } = await sleep()
      file.url = url
    },
    abort() {
      this.$refs.uploaderRef.abort()
    },
    submit() {
      this.$refs.uploaderRef.submit()
    }
  }
}
</script>

<style scoped>
html,
body {
  width: 100%;
  height: 100%;
}
</style>
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
