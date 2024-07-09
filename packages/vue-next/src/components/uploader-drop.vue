<template>
  <div class="uploader-drop">
    <slot></slot>
  </div>
</template>

<script setup>
import { inject, nextTick, onMounted } from 'vue'

onMounted(() => {
  const uploader = inject('uploader')
  nextTick(() => {
    uploader.value.assignBrowse(document.querySelector('.uploader-drop'))
    uploader.value.assignDrop(document.querySelector('.uploader-drop'))
  })
})
</script>

<style>
.uploader-drop {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 350px;
  height: 150px;
  border: 1px dashed #dcdfe6;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
