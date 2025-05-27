# 方法

## assignBrowse

绑定上传按钮 dom

```ts
uploader.assignBrowse(domNode: HTMLElement, attributes: UserAttributes)
```

attributes 是 input 文件的属性对象，可覆盖属性中的 accept 和 multiple，或者添加别的属性

> [!NOTE]
> 枚举[`UserAttributes`](/sdk/enum.md#user-attributes)

## assignDrop

绑定上传拖拽 dom

```ts
uploader.assignDrop(domNode: HTMLElement)
```

## submit

`autoUpload`为`false`时可手动触发上传

```js
uploader.submit()
```

## clear

删除所有文件，且取消正在上传中文件的请求

```js
uploader.clear()
```

## remove

删除某个文件，参数是文件 file, 如果没有参数时效果同`clear`方法

```js
uploader.remove(file)
```

## pause

暂停某个文件上传，参数是文件 file

```js
uploader.pause(file)
```

## resume

重新启动某个暂停文件，参数是文件 file

```js
uploader.resume(file)
```

## retry

手动触发某个文件重试，参数是文件 file

```js
uploader.retry(file)
```
