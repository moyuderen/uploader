# @tinyuploader/sdk

## 2.2.1-alpha.0

### Patch Changes

- support hash plugin

## 2.2.0

### Minor Changes (2025-05-27)

#### 新增

- 导出：import { FileStatus, ChunkStatus, Callbacks } from '@tinyuploader/sdk'
- 配置：Uploader 新增默认参数 fileList
- 配置：Uploader 添加默认参数 addFailToRemove，添加文件失败时是否删除
- 配置：支持自定义上传接口 customRequest
- 配置：updateData 更新 data
- 配置：updateHeaders 更新 headers
- 配置：processData 方法，用户自定义处理 data
- 配置：setDefaultFileList 异步设置 fileList
- 状态：FileStatus.addFail 状态，文件添加失败状态
- 状态：FileStatus.checkFail 状态，checkRequest 存在时，且 checkRequest 失败文件变更为 checkFail
- 状态：CheckStatus.waitMerge, 文件上传完毕等待合并
- 回调：fileAddFail
- 回调：fileReadStart
- 回调：fileReadProgress
- 回调：fileReadEnd
- 回调：fileReadFail
- 方法：destroy，清空 fileList, 取消所有请求，卸载 dom 以及 dom 的 事件监听；删除 Uploader 相关事件监听
- File: errorMessage 属性，记录错误信息
- File: data 属性，给 file 添加自定义参数 file.setData
- File: renderSize, 文件大小格式化展示(2.3GB)
- File: mergeRequest 成功时自动设置 url

#### 变更

- 导出：Status -> FileStatus, ChunkStatus
- 导出：Events -> Callbacks
- 配置：chunkSize 默认为 1024 _1024_ 2（2m）
- 配置：headers, data 支持函数，默认返回{}
- 配置：action 默认为''
- 配置：checkFileRequest -> checkRequest
- 配置：beforeAdd 支持异步，返回 false，或者 reject 时添加失败
- 方法：computedHashWorker -> useWebWoker
- File: 文件属性变更 file.path -> file.url
- File: checkRequest 支持异步，返回 false，或者 reject 时失败

#### 优化

- reading（计算 hash 过程） 状态可以暂停或者取消
- 优化抽离 request.js
- 优化 events.js

## 2.1.1

### Patch Changes

- fix: 重试机制

## 2.1.0

### Minor Changes

- 新增 FileChange 回调函数

## 2.0.7

### Patch Changes

- 删除 Inited 回调

## 2.0.6

### Patch Changes

- 增加 Events.Inited 回调

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
