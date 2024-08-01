<template>
  <span class="tiny-uploader-btn">
    <slot></slot>
  </span>
</template>

<script>
export default {
  mounted() {
    this.$nextTick(() => {})
  }
}
</script>

<style>
.tiny-uploader-btn {
  color: #409eff;
}
</style>
