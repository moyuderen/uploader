<template>
  <div class="uploader">
    <uploader-drop>
      <span style="margin-right: 6px;">Drop file here or</span>
      <uploader-btn>
        click to upload
      </uploader-btn>
    </uploader-drop>
    <slot :file-list="files">
      <uploader-list :file-list="files"></uploader-list>
    </slot>
  </div>
</template>

<script setup>
import { onMounted, ref, provide } from 'vue'
import Uploader from '@uploader/sdk'
import uploaderDrop from './uploader-drop.vue';
import uploaderBtn from './uploader-btn.vue'
import uploaderList from './uploader-list.vue';

const uploader = ref(null)
const files = ref([])

uploader.value = new Uploader()
provide('uploader', uploader)

onMounted(() => {

  uploader.value.on('filesAdded', (fileList) => {
    files.value = fileList
  })

  uploader.value.on('allSuccess', (fileList) => {
    console.log('全部上传成功', fileList)
    files.value = fileList
  })

  uploader.value.on('fileUploadSuccess', (file, fileList) => {
    console.log(`${file.name}上传成功`, file, fileList)
    files.value = fileList
  })

  uploader.value.on('fileSuccess', (file, fileList) => {
    console.log(`${file.name}合并成功`, file, fileList)
    files.value = fileList
  })

  uploader.value.on('fileFail', (file, fileList) => {
    console.log(`${file.name}上传失败`, file, fileList)
    files.value = fileList
  })

  uploader.value.on('fileMergeFail', (file, fileList) => {
    console.log(`${file.name}合并失败`, file, fileList)
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