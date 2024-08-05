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
