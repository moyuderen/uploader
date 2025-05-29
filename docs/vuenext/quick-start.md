---
layout: doc
outline: deep
---

# Quick Start

## 安装

```bash
npm i @tinyuploader/vuenext -S
```

## 使用

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import Uploader from '@tinyuploader/vuenext'
import '@tinyuploader/vuenext/dist/style.css'

const app = createApp(App)

app.use(Uploader)
app.mount('#app')
```

```vue
<template>
  <Uploader
    v-bind="customOption"
    :defaultFileList="defaultFileList"
    ref="uploaderRef"
    @onChange="onChange"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { customOption } from './config'

const uploaderRef = ref()
const defaultFileList = ref([])
const fileList = ref([])
const customOption = {
  // input 属性相关
  drag: true,
  accept: '*',
  multiple: true,

  // 文件相关
  limit: 4,
  autoUpload: true,
  customGenerateUid: null,
  beforeAdd: (file) => {
    if (file.name.endsWith('.js')) {
      file.setErrorMessage('不允许上传js文件')
      return false
    }
  },
  beforeRemove: (_file) => true,
  addFailToRemove: false, // 默认为true
  chunkSize: 2 * 1024 * 1024, // 2M
  fakeProgres: true,
  withHash: true,
  useWebWoker: false,

  // 上传逻辑相关
  name: 'file',
  action: 'http://localhost:3000/file/upload',
  customRequest: null,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'xxxx-xx-xxxx'
  },
  data: {},
  requestSucceed: (xhr) => [200, 201, 202, 206].includes(xhr.status),
  maxConcurrency: 10,
  maxRetries: 3,
  retryInterval: 500,
  checkRequest: async ({ hash, name: filename }) => {
    const { data } = await request({
      url: '/check',
      method: 'get',
      params: {
        hash,
        filename,
        status: 'none'
      }
    })

    return data
  },
  mergeRequest: async ({ hash, name: filename }) => {
    const { data } = await request({
      url: '/merge',
      method: 'get',
      params: {
        hash,
        filename
        // status_error: Math.random() > 0.5 ? 'error' : undefined
      }
    })

    return data
  },
  processData: (data, _processType) => data,
  customStatus: {}
}

onMounted(() => {
  setTimeout(() => {
    defaultFileList.value = [{ name: 'default.png', url: 'https://baidu.com', id: '1' }]
  }, 300)
})
const onChange = (_file, list) => {
  fileList.value = list
}
</script>
```

属性、方法用法参考[`@tinyuploader/vue`](/vue/quick-start)

## [demo](https://codesandbox.io/p/devbox/dtv5l3)

## [更新日志](https://github.com/moyuderen/uploader/blob/main/packages/vue-next/CHANGELOG.md)
