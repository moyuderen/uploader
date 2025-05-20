# 枚举

## Status {#status}

```typescript
/** v2.1.1之前 file和chunk状态公用*/

enum Status {
  /** 文件初始化状态 */
  Init = 'init',

  /** 计算hash中（读取文件） */
  Reading = 'reading',

  /**
   * 1.file文件hash计算完成
   * 2.chunk初始化状态是Ready
   */
  Ready = 'ready',

  /** 1.chunk的已经发起请求，Promise处于Pending状态 */
  Pending = 'pending',

  /**
   * 1.file在上传中
   * 2.chunk上传中
   */
  Uploading = 'uploading',

  /** 文件的所有chunk上传完成, 准备合并文件 */
  UploadSuccess = 'uploadSuccess',

  /** 文件所有chunk已经请求上传接口，但是自动重试之后仍有失败时，文件状态为UploadFail */
  UploadFail = 'uploadFail',

  /**
   * 1.文件合并成功
   * 2.chunk上传成功
   */
  Success = 'success',

  /**
   * 1.文件合并失败
   * 2.chunk上传（所有重试都不成功）失败
   */
  Fail = 'fail',

  /** 暂停状态 */
  Pause = 'pause',

  /** 恢复状态 */
  Resume = 'resume'
}
```

> [!WARNING]
> 2.2.0 版本之后拆分为了[`FileStatus`](#file-status)和[`ChunkStatus`](#chunk-status)

## Events {#events}

```typescript
export const Events = {
  Exceed: 'exceed',
  FilesAdded: 'filesAdded',
  FileChange: 'fileChange',
  FileRemove: 'fileRemove',
  FileProgress: 'fileProgress',
  FileFail: 'fileFail',
  FileUploadFail: 'fileUploadFail',
  FileUploadSuccess: 'fileUploadSuccess',
  FileSuccess: 'fileSuccess',
  // FileMergeFail: 'fileMergeFail', // 2.x版本删除 // [!code --]
  AllFileSuccess: 'allFilesSuccess',
  Change: 'change'
}
```

> [!WARNING]
> 2.2.0 版本之后`Events`抽象为了[`Callbacks`](#callbacks)

## FileStatus {#file-status}

```typescript
enum FileStatus {
  /** 文件初始化状态 */
  Init = 'init',

  /** 文件添加失败, 添加文件时允许beforeAdd中失败的文件添加到列表，但是状态为AddFail */
  AddFail = 'addFail',

  /** 文件读取中（计算hash中）*/
  Reading = 'reading',

  /** 文件hash计算完成；准备上传 */
  Ready = 'ready',

  /** checkRequest 存在时，且checkRequest失败 */
  CheckFail = 'checkFail',

  /** 文件上传中 */
  Uploading = 'uploading',

  /** 文件上传完成；所有chunk上传完成，准备合并文件 */
  UploadSuccess = 'uploadSuccess',

  /** 文件上传失败；有chunk上传失败 */
  UploadFail = 'uploadFail',

  /** 文件上传成功 且 合并成功 */
  Success = 'success',

  /** 文件合并失败 */
  Fail = 'fail',

  /** 文件暂停上传 */
  Pause = 'pause',

  /** 文件恢复上传 */
  Resume = 'resume'
}
```

## ChunkStatus {#chunk-status}

```typescript
enum ChunkStatus {
  /** chunk初始化状态是Ready */
  Ready = 'ready',

  /** chunk创建请求成功，Promise处于Pending状态 */
  Pending = 'pending',

  /** chunk上传中 */
  Uploading = 'uploading',

  /** chunk上传成功 */
  Success = 'success',

  /** chunk上传失败（所有重试次数完成后 都不成功）*/
  Fail = 'fail'
}
```

## Callbacks {#callbacks}

```typescript
// 回调函数名称
enum Callbacks {
  /** 文件超出limit限制 */
  Exceed = 'exceed',

  /** 单个文件添加成功 */
  FileAdded = 'fileAdded',

  /** 文件添加失败 */
  FileAddFail = 'fileAddFail',

  /** 所有文件添加成功 */
  FilesAdded = 'filesAdded',

  /** 文件状态改变 */
  FileChange = 'fileChange',

  /** 文件删除 */
  FileRemove = 'fileRemove',

  /** 文件开始计算hash */
  FileReadStart = 'fileReadStart',

  /** 文件计算进度 */
  FileReadProgress = 'fileReadProgress',

  /** 文件hash计算完成 */
  FileReadEnd = 'fileReadEnd',

  /** 文件hash计算失败 */
  FileReadFail = 'fileReadFail',

  /** 文件上传进度 */
  FileProgress = 'fileProgress',

  /** 文件上传成功 */
  FileUploadSuccess = 'fileUploadSuccess',

  /** 文件上传失败 */
  FileUploadFail = 'fileUploadFail',

  /** 文件合并成功 */
  FileSuccess = 'fileSuccess',

  /** 文件合并失败 */
  FileFail = 'fileFail',

  /** 所有文件上传成功 */
  AllFileSuccess = 'allFileSuccess'
}
```

## CheckStatus {#check-status}

```typescript
// check 文件上传状态
enum CheckStatus {
  /** 文件还没上传 */
  None = 'none',

  /**
   * 1. 部分上传成功
   * 2. 返回已上传chunk的索引
   * */
  Part = 'part',

  /** 准备合并，可以直接进行合并操作 */
  WaitMerge = 'waitMerge',

  /** 上传成功, 返回文件obs地址 */
  Success = 'success'
}
```

## ProcessType {#process-type}

```typescript
// 文件上传进程
enum ProcessType {
  /** 来自check接口 */
  Check = 'check',

  /** 来自upload接口 */
  Upload = 'upload',

  /** 来自merge接口 */
  Merge = 'merge'
}
```

## UserAttributes {#user-attributes}

```typescript
type UserAttributes = {
  accept: string | string[]
  multiple: boolean
  [key: string]: any
}
```
