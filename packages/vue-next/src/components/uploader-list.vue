<template>
  <div class="uploader-list">
    <div v-for="file in fileList" :key="file.id">
      <slot :file="file"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  fileList: Array
})
</script>
