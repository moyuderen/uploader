# @tinyuploader/sdk

## Quick start

### 安装

```
npm i @tinyuploader/sdk -S
```

## 使用

```javascript
import Uploader from '@tinyuploader/sdk'

const options = {
  action: 'https://jsonplaceholder.typicode.com/posts'
}

const uploader = new Uploader(options)

uploader.assignBrowse(document.querySelector('.uploader-btn'))
```

### [Demo 展示](https://github.com/moyuderen/uploader/tree/main/packages/sdk/example/index.html)

## 参数

| 参数                 | 说明                                                         | 默认值                                                       | 类型             |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ---------------- |
| TODO: multipart      | 是否为分片上传                                               | true                                                         | boolean          |
| accept               | 接受的上传文件类型可被方法assignBrowse中的attributes覆盖     | *                                                            | string           |
| multiple             | 是否支持多选文件，可被方法assignBrowse中的attributes覆盖     | true                                                         | boolean          |
| limit                | 上传最大数量，为0时不限制                                    | 0                                                            | number           |
| fileList             | 已上传的文件列表,为File实例                                  | []                                                           |                  |
| name                 | 上传文件名称                                                 | name                                                         | string           |
| autoUpload           | 自动上传                                                     | true                                                         |                  |
| beforeAdd            | 所有上传动作开始上传前, false或者reject则停止上传，参数是file, |                                                              | function         |
| beforeRemove         | 删除文件 false或者reject则停止上传，参数是file               |                                                              | function         |
| action               | 上传地址                                                     | https://jsonplaceholder.typicode.com/posts                   | 接口             |
| fakeProgress         | 是否使用模拟进度条，为false时会有进度条回退                  | true                                                         | boolean          |
| checkFileRequest     | 校验文件，秒传，断点续传。默认不校验文件， 看下方的详细说明；使用尽量保证withHash开启，因为校验时会用到hash去后端校验。默认参数是file |                                                              | function         |
| withCredentials      | 携带cookie                                                   | true                                                         | boolean          |
| headers              | 自定义headers                                                | { }                                                          | object           |
| data                 | 请求的其他参数                                               | { }                                                          | object           |
| withHash             | 是否给file文件生成hash                                       | true                                                         | boolean          |
| computedhashInWorker | 如果浏览器支持，是否启用web worker来计算文件hash             | true                                                         | boolean          |
| chunkSize            | chunk的大小单位为字节                                        | 1024 * 4(4kb)                                                | number           |
| maxRetries           | 最大重试次数                                                 | 3                                                            | number           |
| retryInterval        | 重试间隔，单位是ms                                           | 1000                                                         | number           |
| maxConcurrency       | 最大并发数，浏览器支持最大请求数                             | 6                                                            | number           |
| customGenerateUid    | 自定义id生成规则                                             | null                                                         | function \| null |
| requestSucceed       | 校验是否上传成功，根据接口定义，通过http的status或者code判断，参数是xhr对象 | `requestSucceed(xhr) { return [200, 201, 202].includes(xhr.status) }` | function         |
| mergeRequest         | 合并文件请求，参数是file, 返回一个成功cdn地址，支持异步      | 默认是返回true的函数                                         | function         |

`checkFileRequest` 参数详细说明

```javascript
const CheckStatus = {
  Part: 'part', // 部分上传成功
  Success: 'success', // 全部上传成功
  None: 'none' // 没有上传
}

const checkFileApi = (hash) => { 
  // ...
}

// 情况一；默认不校验
async checkFileRequest(file) {
  const hash = file.hash
  const { data } = await checkFileApi(hash)
  return { status: CheckStatus.None }
}

// 情况二；根据文件hash,文件已经上传
async checkFileRequest(file) {
  const hash = file.hash
  const { data } = await checkFileApi(hash)
  return { 
    status: CheckStatus.Success,
    data: 'http://baidu.com' // data是一个上传成功文件的url地址
  }
}

// 情况三；根据文件hash,文件部分上传成功
async checkFileRequest(file) {
  const hash = file.hash
  const { data } = await checkFileApi(hash)
  return { 
    status: CheckStatus.Part,
    data: [0, 2, 4, 6, 8, 10] // data是已经上传成功chunk的chunkIndex
  }
}
```

## 回调函数

| 回调函数          | 说明                                             | 参数                     | 类型 |
| ----------------- | ------------------------------------------------ | ------------------------ | ---- |
| TODO: change      |                                                  |                          |      |
| exceed            | 超出最大上传个数                                 | fileList                 |      |
| filesAdded        |                                                  | fileList                 |      |
| fileSuccess       | 某个文件上传成功，参数file, fileList             | file，fileList           |      |
| fileFail          | 文件合并失败回调                                 | file，fileList           |      |
| fileProgress      | 上传进度回调                                     | progress, file，fileList |      |
| fileRemove        | 删除文件的回调                                   | file，fileList           |      |
| fileUploadFail    | 所有chunk上传过，且有失败                        | file，fileList           |      |
| fileUploadSuccess | 所有chunks上传成功，但是未调用合并接口，准备合并 | file，fileList           |      |
| fileMergeFile     | 合并接口失败                                     | file，fileList           |      |
| allFilesSuccess   | 所有文件上传成功                                 | fileList                 |      |

## 回调函数名称枚举值

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
  // FileMergeFail: 'fileMergeFail', // 2.x版本删除
  AllFileSuccess: 'allFilesSuccess',
  Change: 'change' // TODO
}
```

## 方法

| 方法         | 说明                                                         | 默认值 | 类型 |
| ------------ | ------------------------------------------------------------ | ------ | ---- |
| assignBrowse | assignBrowse(domNode, attributes);attributes是input文件的属性对象，可覆盖熟悉中的accept和multiple，或者添加别的属性 |        |      |
| assignDrop   | assignDrop(attributes)                                       |        |      |
| submit       | 手动提交                                                     |        |      |
| clear        | 清除fileList, 取消正在上传的请求                             |        |      |
| remove       | 参数是文件，有文件时删除当前文件以及去取消当前文件正在上传的请求，没有参数时删除所有文件 |        |      |
| pause        | 暂停某个文件上传，参数是file, 参数必传                       |        |      |
| resume       | 恢复某个文件上传，参数是file, 参数必传                       |        |      |
| retry        | 重试某个文件上传，参数是file, 参数必传                       |        |      |

## 状态

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

## Uploader

```typescript
// 关键属性
class Uploader {
  // 默认文件列表
  fileList: File[];
  // 参数配置项
  opts: object;
}

Uploader.Status = Status
Uploader.Events = Events
Uploader.File = File
Uploader.create = (options) => {
  return new Uploader(options)
}
```

## File

```typescript
// 关键属性 
class File { 
    // uploader实例
    uploader: Uploader;

    // 参数配置项
    opts: object

    uid: string

    hash: string

    size: number

    name: string

    // 文件类型.png, .jpg等
    type: string

    // 分片大小
    chunkSize: number 

    status: Status.Init | Status.Ready | Status.Uploading | Status.Pause | Status.Resume | Status.UploadSuccess | Status.UploadFail | Status.Success | Status.Fail

    progress: number;

    // chunk的实例数组
    chunks: Chunk[]

    // 读取文件（计算has）的进度
    readProgress: number
}
```

## Chunk

```typescript
class Chunk { 
    // uploader实例
    uploader: Uploader;

    // 参数配置项
    opts: object

    file: File

    fileName: string

    // 文件id
    fileId: string

    // 文件hash
    fileHash: string

    // 文件总大小
    totalSize: number

     // 分片大小
    chunkSize: number 

    // chunk索引，从0开始
    chunkIndex: number

    uid: string

    size: number

}

// 上传的参数
type PostFormData = {
    // chunk二进制数据
    // [opts.name]: Blob

    // chunk的uid
    id: string

    // 文件uid
    fileId: string

    // 文件名称
    filename: string

    // chunk索引，从0开始
    index: number

    // 当前chunk大小
    size: number

    // 文件总大小
    totalSize: number
}
```

## [CHANGELOG](https://github.com/moyuderen/uploader/blob/main/packages/sdk/CHANGELOG.md)
