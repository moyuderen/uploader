# @tinyuploader/sdk

## 2.0.5

### Patch Changes

- chore: package.json

## 2.0.4

### Patch Changes

- 优化 sdk 暴露

## 2.0.3

### Patch Changes

- 优化默认值 fileList 传入方式

## 2.0.2

### Patch Changes

- 1. 优化默认参数
  2. 更新 sdk 文档

## 2.0.1

### Patch Changes

- 新增 checkFileRequest 参数, 支持提前通过接口校验该文件的上传情况

## 2.0.0

### Major Changes

- 新增

  1. limit
  2. accept
  3. multiple
  4. computedhashInWorker
  5. fakeProgress
  6. beforeAdd
  7. beforeRemove
  8. 添加 exceed 回调, 超出 limit 的回调
  9. 提供新的回调 FileUploadFail

- 修改：

  1. target -> action
  2. retries -> maxRetries
  3. concurrency -> maxConcurrency
  4. generateUniqueIdentifier -> customGenerateUid
  5. successStatuses -> requestSucceed
  6. merge -> mergeRequest
  7. hasFileHash -> withHash 选择是否生成文件 hash

- 删除：

  1. hasChunkHash 去掉, 使用文件的 hash 和 chunk 的索引来定位问题
  2. 去掉 fileMergeFile 使用 fail 代替，提供新的回调 FileUploadFail

- 其他

  1. file 状态增加 Reading 状态
  2. file 增加 UploadFail 状态
  3. file 增加 readingProgress 进度
  4. 抽离绑定 dom 类
  5. Event 继承方式改为注入
  6. 优化 uploader 实例监听全部成功回调
  7. 优化 file 的 hash 计算方式；支持 web worker 或者在线程中操作
  8. 优化内部代码

## 1.1.0

### Minor Changes

- hasFileHash: 文件的 hash

## 1.0.14

### Patch Changes

- 支持 hasChunkHash 为每个 chunk 创建唯一值 hash

## 1.0.12

### Patch Changes

- 1. 优化内部代码
  2. 操作时参数 id 改为 file 文件

## 1.0.11

### Patch Changes

- 打包配置

## 1.0.10

### Patch Changes

- 5315ec6: 更新包名称为 tinyuploader

## 1.0.9

### Patch Changes

- 更新包名称为 tinyuploader

## 1.0.8

### Patch Changes

- 支持默认参数
