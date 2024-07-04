<template>
  <button class="uploader-btn">
    uploader4
  </button>

  <div>
    <div v-for="file in files" :key="file.id">
      {{ file.name }} {{ file.progress * 100 }} {{ file.status }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Uploader from '@uploader/sdk'
const uploader = ref(null)
const files = ref([])

onMounted(() => {
  uploader.value = new Uploader()

  uploader.value.assignBrowse(document.querySelector('.uploader-btn'))

  uploader.value.on('filesAdded', (fileList) => {
    files.value = fileList
  })

  uploader.value.on('allSuccess', (fileList) => {
    console.log('全部上传成功', fileList)
    files.value = fileList
  })

  uploader.value.on('fileSuccess', (file, fileList) => {
    console.log(`${file.name}上传成功`, file, fileList)
    files.value = fileList
  })

  uploader.value.on('fileFail', (file, fileList) => {
    console.log(`${file.name}上传失败`, file, fileList)
    files.value = fileList
  })

  uploader.value.on('fileRemove', (file, fileList) => {
    console.log(`${file.name}被删除`, file, fileList)
    files.value = fileList
  })

  uploader.value.on('fileProgress', (progress, file, fileList) => {
    // console.log(`${file.name} progress ${progress}`, file, fileList)
  })
})


</script>