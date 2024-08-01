<template>
  <div class="tiny-uploader-drop">
    <slot></slot>
  </div>
</template>

<script>
import { uploaderMixin } from '../common/mixins'
export default {
  mixins: [uploaderMixin],
  mounted() {
    this.$nextTick(() => {
      this.uploader.assignBrowse(document.querySelector('.tiny-uploader-drop'))
      this.uploader.assignDrop(document.querySelector('.tiny-uploader-drop'))
    })
  }
}
</script>

<style>
.tiny-uploader-drop {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 350px;
  height: 150px;
  border: 1px dashed #dcdfe6;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}

.tiny-uploader-drop:hover {
  border: 1px dashed #409eff;
}
</style>
