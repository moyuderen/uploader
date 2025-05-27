# 回调函数

## 回调函数枚举值

> [!CAUTION]
> 版本`2.2.0` 之前使用[`Events`](enum.md#events)
>
> 版本`2.2.0`包括以及之后使用[`Callbacks`](enum.md#callbacks)

::: info `2.2.0`版本之前例子

```js
const uploader = new Uploader({
  limit: 10
})

uploader.on(Events.Exceed, (files, fileList) => {
  // ...
})
```

:::

## exceed

选取文件时，文件总个数大于`limit`参数回调, 参数是`files`是选中的文件列表，`fileList`是已经存在的文件列表

```js
const uploader = new Uploader({
  limit: 10
})
uploader.on(Callbacks.Exceed, (files, fileList) => {
  // ...
})
```

> [!IMPORTANT]
> 版本`2.2.0`之后不返回 fileList 参数

## fileAdded <Badge type="tip">2.2.0 新增</Badge> {#fileAdded}

某文件选取成功添加到 `fileList` (准备上传之前)

```js
uploader.on(Callbacks.FileAdded, (file) => {
  // ...
})
```

## fileAddFail <Badge type="tip">2.2.0 新增</Badge>

文件选取成功添加到 `fileList` (准备上传之前)

```js
uploader.on(Callbacks.FileAddFail, (file) => {
  // ...
})
```

## filesAdded

文件选取成功添加到 `fileList` (准备上传之前)

```js
uploader.on(Callbacks.FilesAdded, (fileList) => {
  // ...
})
```

## fileChange <Badge type="tip">2.1.0 新增</Badge>

文件`status`发生变化时触发

```js
uploader.on(Callbacks.FileChange, (file, fileList) => {
  // ...
})
```

## fileRemove

某个文件删除被删除

```js
uploader.on(Callbacks.FileRemove, (file, fileList) => {
  // ...
})
```

## fileReadStart

文件开始读取

```js
uploader.on(Callbacks.FileReadStart, (file, fileList) => {
  // ...
})
```

## fileReadProgress

文件计算 hash 进度

```js
uploader.on(Callbacks.FileReadProgress, (file, fileList) => {
  // ...
})
```

## fileReadEnd

文件计算 hash 完成

```js
uploader.on(Callbacks.FileReadEnd, (file, fileList) => {
  // ...
})
```

## fileReadFail

文件计算 hash 失败

```js
uploader.on(Callbacks.FileReadFail, (file, fileList) => {
  // ...
})
```

## fileProgress

文件上传中，可获取进度

```js
uploader.on(Callbacks.FileProgress, (progress, file, fileList) => {
  // ...
})
```

> [!WARNING]
> 版本`2.2.0`之后不再返回 progress 参数

## FileFail

文件上传失败（该文件所有 chunk 上传成功，但是合并文件时失败了）

```js
uploader.on(Callbacks.FileFail, (file, fileList) => {
  // ...
})
```

## fileUploadFail

文件上传失败（该文件所有 chunk 上传过，但是有未成功的 chunk）

```js
uploader.on(Callbacks.FileUploadFail, (file, fileList) => {
  // ...
})
```

## fileUploadSuccess

文件上传成功（该文件所有 chunk 上传过，且所有都上传成功，准备调用合并文件接口）

```js
uploader.on(Callbacks.FileUploadSuccess, (file, fileList) => {
  // ...
})
```

## fileSuccess

文件上传成功（合并接口也调用成功）

```js
uploader.on(Callbacks.FileSuccess, (file, fileList) => {
  // ...
})
```

## ~~FileMergeFail~~ <Badge type="danger" text=" 2.x 版本删除" />

文件合并失败

```js
uploader.on(Events.FileMergeFail, (file, fileList) => {
  // ...
})
```

## fileFail <Badge type="tip" text=" 2.2.0 新增" />

文件合并失败

```js
uploader.on(Callbacks.FileFail, (file, fileList) => {
  // ...
})
```

## allFileSuccess

所有文件上传成功

```js
uploader.on(Callbacks.AllFileSuccess, (fileList) => {
  // ...
})
```

```

```

```

```
