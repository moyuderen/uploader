<template>
  <span class="uploader-btn">
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

<style scoped>
.uploader-btn {
  color: #409eff;
}
</style>
