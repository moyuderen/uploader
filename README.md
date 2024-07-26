# uploader

## 参数

| **参数**             | **说明**                                                     | **默认值**                                                   | **类型**         |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ---------------- |
| TODO: multipart      | 是否为分片上传                                               | true                                                         | boolean          |
| accept               | 接受的上传文件类型可被方法assignBrowse中的attributes覆盖     |                                                              | string           |
| multiple             | 是否支持多选文件，可被方法assignBrowse中的attributes覆盖     |                                                              |                  |
| limit                | 上传最大数量，为0时不限制                                    | 0                                                            | number           |
| fileList             | 已上传的文件列表                                             |                                                              |                  |
| name                 | 上传文件名称                                                 | name                                                         | string           |
| autoUpload           | 自动上传                                                     | true                                                         |                  |
| beforeAdd            | 所有上传动作开始上传前, false或者reject则停止上传，参数是file, |                                                              | function         |
| beforeRemove         | 删除文件 false或者reject则停止上传，参数是file               |                                                              |                  |
| action               | 上传地址                                                     | https://jsonplaceholder.typicode.com/posts                   | 接口             |
| fakeProgress         | 是否使用模拟进度条，为false时会有进度条回退                  | true                                                         |                  |
| TODO: checkFileUrl   | 校验文件，秒传，断点续传                                     |                                                              |                  |
| withCredentials      | 携带cookie                                                   | true                                                         |                  |
| headers              | 自定义headers                                                | { }                                                          |                  |
| data                 | 请求的其他参数                                               | { }                                                          |                  |
| withHash             | 是否给file文件生成hash                                       | true                                                         |                  |
| computedhashInWorker | 如果浏览器支持，是否启用web worker来计算文件hash             | true                                                         |                  |
| chunkSize            | chunk的大小单位为字节                                        | 1024 * 4(4kb)                                                | number           |
| maxRetries           | 最大重试次数                                                 | 3                                                            |                  |
| retryInterval        | 重试间隔，单位是ms                                           | 1000                                                         |                  |
| maxConcurrency       | 最大并发数，浏览器支持最大请求数                             | 6                                                            |                  |
| customGenerateUid    | 自定义id生成规则                                             | null                                                         | function \| null |
| requestSucceed       | 校验是否上传成功，根据接口定义，通过http的status或者code判断，参数是xhr对象 | `requestSucceed(xhr) {  return [200, 201, 202].includes(xhr.status) }` | function         |
| mergeRequest         | 合并文件请求，参数是file, 返回一个成功cdn地址，支持异步      |                                                              | function         |

## 回调函数

| **回调函数**      | **说明**                                         | **参数**       | **类型** |
| ----------------- | ------------------------------------------------ | -------------- | -------- |
| TODO: change      |                                                  |                |          |
| exceed            | 超出最大上传个数                                 | fileList       |          |
| filesAdded        |                                                  | fileList       |          |
| fileSuccess       | 某个文件上传成功，参数file, fileList             | file，fileList |          |
| fileFail          | 文件合并失败回调                                 | file，fileList |          |
| fileProgress      | 上传进度回调                                     | file，fileList |          |
| fileRemove        | 删除文件的回调                                   | file，fileList |          |
| fileUploadFail    | 所有chunk上传过，且有失败                        | file，fileList |          |
| fileUploadSuccess | 所有chunks上传成功，但是未调用合并接口，准备合并 | file，fileList |          |
| fileMergeFile     | 合并接口失败                                     |                |          |
| allFilesSuccess   | 所有文件上传成功                                 | fileList       |          |

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

| **方法**     | **说明**                                                     | **默认值** | **类型** |
| ------------ | ------------------------------------------------------------ | ---------- | -------- |
| assignBrowse | assignBrowse(domNode, attributes);attributes是input文件的属性对象，可覆盖熟悉中的accept和multiple，或者添加别的属性 |            |          |
| assignDrop   | assignDrop(attributes)                                       |            |          |
| submit       | 手动提交                                                     |            |          |
| clear        | 清除fileList, 取消正在上传的请求                             |            |          |
| remove       | 参数是文件，有文件时删除当前文件以及去取消当前文件正在上传的请求，没有参数时删除所有文件 |            |          |
| pause        | 暂停某个文件上传，参数是file, 参数必传                       |            |          |
| resume       | 恢复某个文件上传，参数是file, 参数必传                       |            |          |
| retry        | 重试某个文件上传，参数是file, 参数必传                       |            |          |

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



