# 回调函数

## 回调函数名称枚举

```javascript
const Events = {
  Inited: 'inited', // 2.0.6新增
  Exceed: 'exceed',
  FilesAdded: 'filesAdded',
  FileRemove: 'fileRemove',
  FileProgress: 'fileProgress',
  FileFail: 'fileFail',
  FileUploadFail: 'fileUploadFail',
  FileUploadSuccess: 'fileUploadSuccess',
  FileSuccess: 'fileSuccess',
  // FileMergeFail: 'fileMergeFail', // 2.x版本删除 // [!code --]
  AllFileSuccess: 'allFilesSuccess',
  Change: 'change' // TODO
}
```

## Inited <Badge type="tip" text=" 2.0.6 新增" />

Uploader 初始化成功

```js
const uploader = new Uploader()
uploader.on(Events.Inited, (fileList) => {
  // ...
})
```

## Exceed

选取文件时，文件总个数大于`limit`参数回调, 参数是`files`是选中的文件列表，`fileList`是已经存在的文件列表

```js
const uploader = new Uploader({
  limit: 10
})
uploader.on(Events.Exceed, (files, fileList) => {
  // ...
})
```

## FilesAdded

文件选取成功添加到 `fileList` (准备上传之前)

```js
uploader.on(Events.FilesAdded, (fileList) => {
  // ...
})
```

## FileRemove

某个文件删除被删除

```js
uploader.on(Events.FileRemove, (file, fileList) => {
  // ...
})
```

## FileProgress

文件上传中，可获取进度

```js
uploader.on(Events.FileProgress, (progress, file, fileList) => {
  // ...
})
```

## FileFail

文件上传失败（该文件所有 chunk 上传成功，但是合并文件时失败了）

```js
uploader.on(Events.FileFail, (file, fileList) => {
  // ...
})
```

## FileUploadFail

文件上传失败（该文件所有 chunk 上传过，但是有未成功的 chunk）

```js
uploader.on(Events.FileUploadFail, (file, fileList) => {
  // ...
})
```

## FileUploadSuccess

文件上传成功（该文件所有 chunk 上传过，且所有都上传成功，准备调用合并文件接口）

```js
uploader.on(Events.FileUploadSuccess, (file, fileList) => {
  // ...
})
```

## FileSuccess

文件上传成功（合并接口也调用成功）

```js
uploader.on(Events.FileSuccess, (file, fileList) => {
  // ...
})
```

## FileMergeFail <Badge type="danger" text=" 2.x 版本删除" />

文件合并失败

```js
uploader.on(Events.FileMergeFail, (file, fileList) => {
  // ...
})
```

## AllFileSuccess

所有文件上传成功

```js
uploader.on(Events.AllFileSuccess, (fileList) => {
  // ...
})
```
