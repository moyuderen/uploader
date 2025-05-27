---
layout: doc
outline: deep
---

# Quick Start

## 安装

```bash
npm i @tinyuploader/vue -S
```

## 使用

```javascript
// main.js
import Vue from 'vue'
import App from './App.vue'
import Uploader from '@tinyuploader/vue'
import '@tinyuploader/vue/dist/style.css'

Vue.use(Uploader)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
```

```vue
<template>
  <div>
    <Uploader
      ref="uploaderRef"
      action="http://localhost:3000/file/upload"
      @onChange="onChange"
    >
    </Uploader>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    onChange(file, fileList) {
      this.fileList = fileList
    },
  }
}
</script>

```

## Props 属性

### 基础属性

参考 `@tinyuploader/sdk` 的[**参数配置**](/sdk/props)

### drag

是否启用拖拽上传

**类型** `boolean`

**默认值** `true`

> [!NOTE]
> 当`drag`开启之后`trigger`slot 不在生效, 当`drag`关闭之后`drop`slot 不在生效

### defaultFileList

默认上传文件列表

**类型** `Defaultfile[]`, [Defaultfile](../sdk/interface.md#defaultfile)

**默认值** `[]`

### 事件属性

参考 `@tinyuploader/sdk` 的[**回调**](/sdk/callbacks)

#### onExceed

参考 [**Exceed**](/sdk/callbacks#exceed)

#### onFileAdded

参考 [**FileAdded**](/sdk/callbacks#fileAdded)

#### onFilesAdded

参考 [**FilesAdded**](/sdk/callbacks#filesadded)

#### onFileRemove

参考 [**FileRemove**](/sdk/callbacks#fileremove)

#### onFileProgress

参考 [**FileProgress**](/sdk/callbacks#fileprogress)

#### onFileUploadSuccess

参考 [**FileUploadSuccess**](/sdk/callbacks#fileuploadsuccess)

#### onAllFileSuccess

参考 [**AllFileSuccess**](/sdk/callbacks#allfilesuccess)

#### onFail

文件上传失败的回调,包括 chunk 失败（文件状态为`uploadFail`），或者 chunk 上传成功但是 merge 失败（文件状态为`fail`）。即`onFileUploadFail`和`FileFail`都会触发`onFail`

`onFail(file, fileList)`

#### onSuccess

文件上传成功的回调，包括上传 chunk 完成，mergr 合并完成，与`onFileSuccess`是一样的

`onSuccess(file, fileList)`

#### onChange

文件列表发生改变时调用

`onChange(file, fileList)`

#### onClick

点击文件时事件

`onClick(file)`

## Methods

### clear

删除所有文件，并且取消所有上传中的请求

```vue
<script>
export default {
  methods: {
    clear() {
      this.$refs.uploaderRef.clear() // [!code focus]
    }
  }
}
</script>
```

### submit

手动触发上传，一般在`autoUpload`为`false`时使用

```vue
<script>
export default {
  methods: {
    submit() {
      this.$refs.uploaderRef.submit() // [!code focus]
    }
  }
}
</script>
```

## Slot

### trigger

触发文件选择框

```vue
<template>
  <Uploader>
    <button slot="trigger">点击上传</button>
  </Uploader>
</template>
```

> [!IMPORTANT]
> 需要`drag`属性为`false`时该插槽才生效

### drop

拖拽上传内容区自定义

```vue
<template>
  <Uploader>
    <divm slot="drop">
      <uploade-icon />
      从这里拖拽可以上传哦😯
    </divm>
  </Uploader>
</template>
```

> [!IMPORTANT]
> 需要`drag`属性为`true`时该插槽才生效

## Demo 展示

- [线上展示](https://codepen.io/moyuderen/full/XWLMMKN)

- [具体代码](https://codepen.io/moyuderen/pen/XWLMMKN)

## [mock 接口](/sdk/server)

## [阅读文档](https://moyuderen.github.io/uploader/vue/quick-start.html)

## [更新日志](https://github.com/moyuderen/uploader/blob/main/packages/vue/CHANGELOG.md)
