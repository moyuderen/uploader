<template>
  <div class="uploader-drop">
    <slot></slot>
  </div>
</template>

<script>
import { uploaderMixin } from '../common/mixins'
export default {
  mixins: [uploaderMixin],
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: '*'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.uploader.assignBrowse(document.querySelector('.uploader-drop'), {
        multiple: this.multiple,
        accept: this.accept
      })
      this.uploader.assignDrop(document.querySelector('.uploader-drop'))
    })
  }
}
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
