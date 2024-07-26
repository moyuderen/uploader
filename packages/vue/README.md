# uploader-vue

## Quick Start

```vue
<template>
  <div id="app">
    <Uploader
      ref="uploaderRef"
      :fileList="fileList"
      :chunkSize="1024 * 1024 * 10"
      @onFilesAdded="onFilesAdded"
      @onFileRemove="onFileRemove"
      @onFileProgress="onFileProgress"
      @onFileFail="onFileFail"
      @onFileUploadSuccess="onFileUploadSuccess"
      @onFileSuccess="onFileSuccess"
      @onFileUploadFail="onFileUploadFail"
      @onAllFileSuccess="onAllFileSuccess"
      :mergeRequest="merge"
    />
    <button @click="abort">取消所有上传</button>
    <button @click="submit">Submit</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [
        {
          url: 'http://baidu.com'
        }
      ]
    }
  },
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
    onFileUploadFail(file, fileList) {
      console.log('上传文件失败', file, fileList)
    },
    onAllFileSuccess(fileList) {
      console.log('全部上传成功', fileList)
    },
    async merge(file) {
      fetch('https://google.com')
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

## 参数

| **参数**             | **说明**                                                                            | **默认值**                                                            | **类型**         |
| -------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------- |
| TODO: multipart      | 是否为分片上传                                                                      | true                                                                  | boolean          |
| accept               | 接受的上传文件类型可被方法 assignBrowse 中的 attributes 覆盖                        |                                                                       | string           |
| multiple             | 是否支持多选文件，可被方法 assignBrowse 中的 attributes 覆盖                        |                                                                       |                  |
| limit                | 上传最大数量，为 0 时不限制                                                         | 0                                                                     | number           |
| fileList             | 已上传的文件列表                                                                    |                                                                       |                  |
| name                 | 上传文件名称                                                                        | name                                                                  | string           |
| autoUpload           | 自动上传                                                                            | true                                                                  |                  |
| beforeAdd            | 所有上传动作开始上传前, false 或者 reject 则停止上传，参数是 file,                  |                                                                       | function         |
| beforeRemove         | 删除文件 false 或者 reject 则停止上传，参数是 file                                  |                                                                       |                  |
| action               | 上传地址                                                                            | <https://jsonplaceholder.typicode.com/posts>                          | 接口             |
| fakeProgress         | 是否使用模拟进度条，为 false 时会有进度条回退                                       | true                                                                  |                  |
| TODO: checkFileUrl   | 校验文件，秒传，断点续传                                                            |                                                                       |                  |
| withCredentials      | 携带 cookie                                                                         | true                                                                  |                  |
| headers              | 自定义 headers                                                                      | { }                                                                   |                  |
| data                 | 请求的其他参数                                                                      | { }                                                                   |                  |
| withHash             | 是否给 file 文件生成 hash                                                           | true                                                                  |                  |
| computedhashInWorker | 如果浏览器支持，是否启用 web worker 来计算文件 hash                                 | true                                                                  |                  |
| chunkSize            | chunk 的大小单位为字节                                                              | 1024 \* 4(4kb)                                                        | number           |
| maxRetries           | 最大重试次数                                                                        | 3                                                                     |                  |
| retryInterval        | 重试间隔，单位是 ms                                                                 | 1000                                                                  |                  |
| maxConcurrency       | 最大并发数，浏览器支持最大请求数                                                    | 6                                                                     |                  |
| customGenerateUid    | 自定义 id 生成规则                                                                  | null                                                                  | function \| null |
| requestSucceed       | 校验是否上传成功，根据接口定义，通过 http 的 status 或者 code 判断，参数是 xhr 对象 | `requestSucceed(xhr) { return [200, 201, 202].includes(xhr.status) }` | function         |
| mergeRequest         | 合并文件请求，参数是 file, 返回一个成功 cdn 地址，支持异步                          |                                                                       | function         |

## 回调函数

| **回调函数**      | **说明**                                           | **参数**       | **类型** |
| ----------------- | -------------------------------------------------- | -------------- | -------- |
| TODO: change      |                                                    |                |          |
| exceed            | 超出最大上传个数                                   | fileList       |          |
| filesAdded        |                                                    | fileList       |          |
| fileSuccess       | 某个文件上传成功，参数 file, fileList              | file，fileList |          |
| fileFail          | 文件合并失败回调                                   | file，fileList |          |
| fileProgress      | 上传进度回调                                       | file，fileList |          |
| fileRemove        | 删除文件的回调                                     | file，fileList |          |
| fileUploadFail    | 所有 chunk 上传过，且有失败                        | file，fileList |          |
| fileUploadSuccess | 所有 chunks 上传成功，但是未调用合并接口，准备合并 | file，fileList |          |
| fileMergeFile     | 合并接口失败                                       |                |          |
| allFilesSuccess   | 所有文件上传成功                                   | fileList       |          |

### 回调函数名称枚举值

```javascript
const Events = {
  Exceed: 'exceed',
  FilesAdded: 'filesAdded',
  FileRemove: 'fileRemove',
  FileProgress: 'fileProgress',
  FileFail: 'fileFail',
  FileUploadFail: 'fileUploadFail',
  FileUploadSuccess: 'fileUploadSuccess',
  FileSuccess: 'fileSuccess',
  // FileMergeFail: 'fileMergeFail',
  AllFileSuccess: 'allFilesSuccess',
  Change: 'change'
}
```

## 方法

| **方法**     | **说明**                                                                                                                  | **默认值** | **类型** |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- |
| assignBrowse | assignBrowse(domNode, attributes);attributes 是 input 文件的属性对象，可覆盖熟悉中的 accept 和 multiple，或者添加别的属性 |            |          |
| assignDrop   | assignDrop(attributes)                                                                                                    |            |          |
| submit       | 手动提交                                                                                                                  |            |          |
| clear        | 清除 fileList, 取消正在上传的请求                                                                                         |            |          |
| remove       | 参数是文件，有文件时删除当前文件以及去取消当前文件正在上传的请求，没有参数时删除所有文件                                  |            |          |
| pause        | 暂停某个文件上传，参数是 file, 参数必传                                                                                   |            |          |
| resume       | 恢复某个文件上传，参数是 file, 参数必传                                                                                   |            |          |
| retry        | 重试某个文件上传，参数是 file, 参数必传                                                                                   |            |          |

## 状态枚举值

```javascript
// File和Chunk的状态是共用，有重合
const Status = {
  Init: 'init', // 文件初始化状态
  Reading: 'reading', // 计算hash,读取文件hash中
  Ready: 'ready', // 1. 文件hash计算完成；2. chunk初始化状态是Ready
  Pending: 'pending', // 1. chunk的已经发起请求，Promise处于Pending状态
  Uploading: 'uploading', // 1. 文件在上传中 2. chunk上传中
  UploadSuccess: 'uploadSuccess', // 文件的所有chunk上传完成, 准备合并文件
  UploadFail: 'uploadFail', // 文件所有chunk已经请求上传接口，但是自动重试之后仍有失败时，文件状态为UploadFail
  Success: 'success', // 1. 文件合并成功 2. chunk上传成功
  Fail: 'fail', // 1. 文件合并失败 2. chunk上传（所有重试都不成功）失败
  Pause: 'pause', // 暂停状态
  Resume: 'resume' // 恢复状态
}
```

## [CHANGELOG](https://github.com/moyuderen/uploader/blob/main/packages/vue/CHANGELOG.md)
