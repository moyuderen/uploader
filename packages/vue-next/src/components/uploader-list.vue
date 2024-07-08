<template>
  <div class="uploader-list">
    <div v-for="file in fileList" :key="file.id">
      <uploader-file :file="file"></uploader-file>
    </div>
  </div>
</template>

<script setup>
import uploaderFile from './uploader-file.vue'

const props = defineProps({
  fileList: Array
})
</script>
