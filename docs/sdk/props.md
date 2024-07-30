# 参数配置

## multipart

是否开启分片上传。

> [!WARNING]
> :sweat_smile: 目前只支持分片上传，整个文件上传还在计划中。

- **类型** `boolean`
- **默认值** `true`

## accept

`<input type="file" accept='video/*'>`的`accept`属性值

- **类型** [string](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept)
- **默认值** `*`

## multiple

`<input type="file" multiple>`的`multiple`属性值

- **类型** `boolean`
- **默认值** `true`

## limit

上传的最大数量

- **类型** `number`
- **默认值** `10`

> [!NOTE]
> 值为`0`时不限制数量

## fileList

默认文件列表

- **类型** [`Uploader.File`](./details.md#file)
- **默认值** `[]`
- **示例**

```js
import Uploader from '@tinyuploader/sdk'

let files = []
const uploader = new Uploader({
  fileList: [
    {
      name: 'haha.md',
      path: 'https://baidu.com'
    }
  ]
})

files = uploader.fileList
```

## name

上传二进制文件数据，参数名称

- **类型** `string`
- **默认值** `file`

## autoUpload

是否在选择文件之后自动上传

- **类型** `boolean`
- **默认值** `true`
