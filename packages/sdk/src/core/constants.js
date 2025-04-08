// File和Chunk的状态是共用，有重合
export const Status = {
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

// 文件状态
export const FileStatus = {
  // 文件初始化状态
  Init: 'init',

  // 文件添加失败, 添加文件时允许beforeAdd中失败的文件添加到列表，但是状态为AddFail
  AddFail: 'addFail',

  // 文件读取中（计算hash中）
  Reading: 'reading',

  // 文件hash计算完成；准备上传
  Ready: 'ready',

  // checkRequest 存在时，切checkRequest失败
  CheckFail: 'checkFail',

  // 文件上传中
  Uploading: 'uploading',

  // 文件上传完成；所有chunk上传完成，准备合并文件
  UploadSuccess: 'uploadSuccess',

  // 文件上传失败；有chunk上传失败
  UploadFail: 'uploadFail',

  // 文件上传成功 且 合并成功
  Success: 'success',

  // 文件合并失败
  Fail: 'fail',

  // 文件暂停上传
  Pause: 'pause',

  // 文件恢复上传
  Resume: 'resume'
}

// chunk状态
export const ChunkStatus = {
  // chunk初始化状态是Ready
  Ready: 'ready',

  // chunk创建请求成功，Promise处于Pending状态
  Pending: 'pending',

  // chunk上传中
  Uploading: 'uploading',

  // chunk上传成功
  Success: 'success',

  // chunk上传失败（所有重试次数完成后 都不成功）
  Fail: 'fail'
}

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
  // FileMergeFail: 'fileMergeFail',
  AllFileSuccess: 'allFilesSuccess',
  Change: 'change'
}

// 回调函数名称
export const Callbacks = {
  // 文件超出limit限制
  Exceed: 'exceed',

  // 单个文件添加成功
  FileAdded: 'fileAdded',

  // 文件添加失败
  FileAddFail: 'fileAddFail',

  // 所有文件添加成功
  FilesAdded: 'filesAdded',

  // 文件状态改变
  FileChange: 'fileChange',

  // 文件删除
  FileRemove: 'fileRemove',

  // 文件开始计算hash
  FileReadStart: 'fileReadStart',

  // 文件计算进度
  FileReadProgress: 'fileReadProgress',

  // 文件hash计算完成
  FileReadEnd: 'fileReadEnd',

  // 文件上传进度
  FileProgress: 'fileProgress',

  // 文件上传成功
  FileUploadSuccess: 'fileUploadSuccess',

  // 文件上传失败
  FileUploadFail: 'fileUploadFail',

  // 文件合并成功
  FileSuccess: 'fileSuccess',

  // 文件上传失败合并失败
  FileFail: 'fileFail',

  // 所有文件上传成功
  AllFileSuccess: 'allFileSuccess'
}

// check 文件上传状态
export const CheckStatus = {
  // 部分上传成功
  Part: 'part',

  // 上传成功
  Success: 'success',

  // 文件还没上传
  None: 'none'
}
