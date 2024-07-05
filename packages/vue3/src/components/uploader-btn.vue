<template>
  <span class="uploader-btn">
    <slot></slot>
  </span>
</template>

<script setup>
import { inject, nextTick, onMounted } from 'vue'

onMounted(() => {
  const uploader = inject('uploader')
  nextTick(() => {
    // uploader.value.assignBrowse(document.querySelector('.uploader-btn'))
  })
})

</script>

<style scoped>
.uploader-btn {
  color: #409eff;
}
</style>