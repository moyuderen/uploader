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
// App.vue
<template>
  <div>
    <Uploader :fileList="fileList" ref="uploaderRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const uploaderRef = ref()
const fileList = ref([{ name: '哈哈', path: 'https://baidu.com' }])

const clear = () => {
  uploaderRef.value.clear()
}

const submit = () => {
  uploaderRef.value.submit()
}
</script>
```

属性、方法用法参考`@tinyuploader/vue`

## [更新日志](https://github.com/moyuderen/uploader/blob/main/packages/vue-next/CHANGELOG.md)
