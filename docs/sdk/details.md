# 详细说明

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

```js
// 关键属性
class Uploader {
  fileList: File[] // 默认文件列表
  opts: object // 参数配置项
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
  uploader: Uploader

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

  status:
    | Status.Init
    | Status.Ready
    | Status.Uploading
    | Status.Pause
    | Status.Resume
    | Status.UploadSuccess
    | Status.UploadFail
    | Status.Success
    | Status.Fail

  progress: number

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
  uploader: Uploader

  // 参数配置项
  opts: object

  file: File

  filename: string

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
```

## 上传接口的参数

```ts
type PostFormData = {
  // chunk二进制数据， name是配置中的名称，默认是file
  [opts.name]: Blob

  // chunk的uid
  id: string

  // 文件uid
  fileId: string

  // 文件名称
  filename: string

  // 文件hash
  hash: string

  // chunk索引，从0开始
  index: number

  // 当前chunk大小
  size: number

  // 文件总大小
  totalSize: number
}
```
