<template>
  <div class="tiny-uploader-list">
    <transition-group name="tiny-uploader-transition">
      <div v-for="file in fileList" :key="file.uid">
        <slot :file="file"></slot>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  fileList: Array
})
</script>

<style lang="scss">
.tiny-uploader-transition-enter-active {
  transition: all 0s ease;
}
.tiny-uploader-transition-leave-active {
  transition: all 1.2s ease;
}
.tiny-uploader-transition-enter-from,
.tiny-uploader-transition-leave-to {
  opacity: 0;
  transform: translateY(-30px);
  transform: translateX(-30px);
}
</style>
