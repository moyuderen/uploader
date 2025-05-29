<template>
  <div class="uploader">
    <uploader-drop>
      <upload-icon :size="40" color="#409eff" style="margin-bottom: 6px" />
      <div>
        <span>Drop file here or</span>
        <uploader-btn> click to upload </uploader-btn>
      </div>
    </uploader-drop>
    <slot :file-list="files">
      <uploader-list :file-list="files" v-slot="{ file }">
        <uploader-file :file="file"></uploader-file>
      </uploader-list>
    </slot>
  </div>
</template>

<script setup>
import { onMounted, ref, provide } from 'vue'
import { create, Callbacks } from '@tinyuploader/sdk'
import UploaderDrop from './components/uploader-drop.vue'
import UploaderBtn from './components/uploader-btn.vue'
import UploaderList from './components/uploader-list.vue'
import UploaderFile from './components/uploader-file.vue'
import UploadIcon from './icons/upload-icon.vue'
import { uploaderProps, uploaderEmits } from './uploader.js'

const props = defineProps(uploaderProps)
const emit = defineEmits(uploaderEmits)

const uploader = ref(null)
const files = ref([])

uploader.value = create(props)
files.value = uploader.value.fileList

provide('uploader', uploader)

onMounted(() => {
  uploader.value.on(Callbacks.Exceed, (files, fileList) => {
    emit('onExceed', files, fileList)
  })

  uploader.value.on(Callbacks.FilesAdded, (fileList) => {
    files.value = fileList
    emit('onFilesAdded', fileList)
  })

  uploader.value.on(Callbacks.FileChange, (file, fileList) => {
    files.value = fileList
    emit('onFileChange', fileList)
  })

  uploader.value.on(Callbacks.FileRemove, (file, fileList) => {
    files.value = fileList
    emit('onFileRemove', file, fileList)
  })

  uploader.value.on(Callbacks.FileProgress, (progress, file, fileList) => {
    emit('onFileProgress', progress, file, fileList)
  })

  uploader.value.on(Callbacks.FileFail, (file, fileList) => {
    files.value = fileList
    emit('onFileFail', file, fileList)
  })

  uploader.value.on(Callbacks.FileUploadFail, (file, fileList) => {
    files.value = fileList
    emit('onFileUploadFail', file, fileList)
  })

  uploader.value.on(Callbacks.FileUploadSuccess, (file, fileList) => {
    files.value = fileList
    emit('onFileUploadSuccess', file, fileList)
  })

  uploader.value.on(Callbacks.FileSuccess, (file, fileList) => {
    files.value = fileList
    emit('onFileSuccess', file, fileList)
  })

  uploader.value.on(Callbacks.AllFileSuccess, (fileList) => {
    files.value = fileList
    emit('onAllFileSuccess', fileList)
  })
})

const clear = () => {
  uploader.value.clear()
}

const submit = () => {
  uploader.value.submit()
}

defineExpose({
  clear,
  submit
})
</script>
