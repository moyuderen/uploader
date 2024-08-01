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
      action="http://localhost:3000/upload"
      :data="{ user: 'moyuderen' }"
      :headers="{ token: 'xxxxxxxx' }"
      accept=".jpg,.json,.png,.dmg"
      :fileList="fileList"
      :chunkSize="1024 * 1024 * 10"
      :checkFileRequest="checkFileRequest"
      :mergeRequest="merge"
      @onExceed="onExceed"
      @onFilesAdded="onFilesAdded"
      @onFileProgress="onProgress"
      @onFileRemove="onRemove"
      @onFail="onFail"
      @onSuccess="onSuccess"
      @onAllFileSuccess="onAllFileSuccess"
      @onChange="onChange"
      @onClick="onClick"
    >
    </Uploader>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [
        {
          name: '哈哈',
          path: 'http://baidu.com'
        }
      ]
    }
  },
  methods: {
    onExceed() {
      console.log('超出最大上传次数了')
    },
    onFilesAdded(fileList) {
      console.log('添加文件成功', fileList)
    },
    onRemove(file, fileList) {
      console.log('删除文件成功', file, fileList)
    },
    onProgress(p, file, fileList) {
      // console.log('上传中', p, file, fileList)
    },
    onFail(file, fileList) {
      console.log('上传失败', file, fileList)
    },
    onSuccess(file, fileList) {
      console.log('上传成功', file, fileList)
    },
    onAllFileSuccess(fileList) {
      console.log('全部上传成功', fileList)
    },
    onChange(fileList) {
      console.log('change', fileList)

      this.fileList = fileList
    },
    onClick(file) {
      console.log(file)
    },

    async checkFileRequest(file) {
      const { hash, name } = file
      const { data } = await axios.post('http://localhost:3000/checkFile', {
        hash,
        name,
        status: 'none'
      })
      return data
    },
    async merge(file) {
      const { hash, name } = file
      const { data } = await axios.post('http://localhost:3000/merge', { hash, name })
      file.path = data.data
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .tiny-uploader-btn {
  color: cornflowerblue;
}
</style>
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

### 事件属性

参考 `@tinyuploader/sdk` 的[**回调**](/sdk/callbacks)

#### onExceed

参考 [**Exceed**](/sdk/callbacks#exceed)

#### onFilesAdded

参考 [**FilesAdded**](/sdk/callbacks#filesadded)

#### onFileRemove

参考 [**FileRemove**](/sdk/callbacks#fileremove)

#### onFileProgress

参考 [**FileProgress**](/sdk/callbacks#fileprogress)

#### onFileFail

参考 [**FileFail**](/sdk/callbacks#filefail)

#### onFileUploadFail

参考 [**FileUploadFail**](/sdk/callbacks#fileuploadfail)

#### onFileUploadSuccess

参考 [**FileUploadSuccess**](/sdk/callbacks#fileuploadsuccess)

#### onFileSuccess

参考 [**FileSuccess**](/sdk/callbacks#filesuccess)

#### onAllFileSuccess

参考 [**AllFileSuccess**](/sdk/callbacks#allfilesuccess)

#### onChange

文件列表发生改变时调用

`onChange(fileList, [file])`

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

## [mock 接口](/sdk/questions.html#模拟接口请求)

## [阅读文档](https://moyuderen.github.io/uploader/vue/quick-start.html)

## [更新日志](https://github.com/moyuderen/uploader/blob/main/packages/vue/CHANGELOG.md)
