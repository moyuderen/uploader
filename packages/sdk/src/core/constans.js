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

export const Events = {
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
