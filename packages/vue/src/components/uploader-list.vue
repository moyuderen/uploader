<template>
  <div class="uploader-list">
    <div v-for="file in fileList" :key="file.id">
      <slot v-bind:file="file"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fileList: Array
  }
}
</script>
