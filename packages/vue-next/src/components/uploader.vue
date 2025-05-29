<template>
  <div class="uploader">
    <uploader-drop v-if="drag">
      <upload-icon :size="40" color="#409eff" style="margin-bottom: 6px" />
      <div>
        <span>Drop file here or</span>
        <uploader-button> click to upload </uploader-button>
      </div>
    </uploader-drop>

    <div v-else class="tiny-uploader-trigger">
      <slot name="trigger" v-bind:scope="{ multiple, accept }">
        <button class="tiny-uploader__trigger-upload-btn">Click to Upload</button>
      </slot>
    </div>

    <slot :file-list="files">
      <uploader-list :file-list="files" v-slot="{ file }">
        <uploader-file :file="file" @click="handleClick(file)" />
      </uploader-list>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide, watch, nextTick } from 'vue'
import { create, Callbacks } from '@tinyuploader/sdk'
import UploaderDrop from './uploader-drop.vue'
import UploaderButton from './uploader-button.vue'
import UploaderList from './uploader-list.vue'
import UploaderFile from './uploader-file.vue'
import UploadIcon from '../icons/upload-icon.vue'
import { uploaderProps } from './uploader.js'

const props = defineProps(uploaderProps)
const emit = defineEmits([
  'onExceed',
  'onFileAdded',
  'onFilesAdded',
  'onFileRemove',
  'onFileProgress',
  'onFileUploadSuccess',
  'onChange',
  'onFail',
  'onSuccess',
  'onAllFileSuccess',
  'onClick'
])

const uploader = ref(create(props))
const files = ref([])
const clear = () => uploader.value.clear()
const submit = () => uploader.value.submit()
provide('uploader', uploader)
defineExpose({
  clear,
  submit
})

onMounted(() => {
  nextTick(() => {
    !props.drag && uploader.value.assignBrowse(document.querySelector('.tiny-uploader-trigger'))
  })
  uploader.value.on(Callbacks.FileChange, (file, fileList) => {
    files.value = fileList
    const timer = setTimeout(() => {
      clearTimeout(timer)
      emit('onChange', file, fileList)
    }, 0)
  })
  uploader.value.on(Callbacks.Exceed, (selectedFiles) => emit('onExceed', selectedFiles))
  uploader.value.on(Callbacks.FileAdded, (file, fileList) => emit('onFileAdded', file, fileList))
  uploader.value.on(Callbacks.FilesAdded, (fileList) => emit('onFilesAdded', fileList))
  uploader.value.on(Callbacks.FileRemove, (file, fileList) => emit('onFileRemove', file, fileList))
  uploader.value.on(Callbacks.FileProgress, (file, fileList) =>
    emit('onFileProgress', file, fileList)
  )
  uploader.value.on(Callbacks.FileUploadSuccess, (file, fileList) =>
    emit('onFileUploadSuccess', file, fileList)
  )
  uploader.value.on(Callbacks.FileAddFail, (file, fileList) => emit('onFail', file, fileList))
  uploader.value.on(Callbacks.FileUploadFail, (file, fileList) => emit('onFail', file, fileList))
  uploader.value.on(Callbacks.FileFail, (file, fileList) => emit('onFail', file, fileList))
  uploader.value.on(Callbacks.FileSuccess, (file, fileList) => emit('onSuccess', file, fileList))
  uploader.value.on(Callbacks.AllFileSuccess, (fileList) => emit('onAllFileSuccess', fileList))
})

const handleClick = (file) => emit('onClick', file)

watch(
  () => props.defaultFileList,
  (newValue) => {
    if (uploader.value && newValue) {
      uploader.value.setDefaultFileList(newValue)
    }
  },
  {
    deep: true
  }
)
</script>
