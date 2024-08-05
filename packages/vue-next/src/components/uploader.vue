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
import { create, Events } from '@tinyuploader/sdk'
import UploaderDrop from './uploader-drop.vue'
import UploaderBtn from './uploader-btn.vue'
import UploaderList from './uploader-list.vue'
import UploaderFile from './uploader-file.vue'
import UploadIcon from './upload-icon.vue'
import { uploaderProps, uploaderEmits } from './uploader.js'

const props = defineProps(uploaderProps)
const emit = defineEmits(uploaderEmits)

const uploader = ref(null)
const files = ref([])

uploader.value = create(props)
files.value = uploader.value.fileList

provide('uploader', uploader)

onMounted(() => {
  uploader.value.on(Events.Exceed, (files, fileList) => {
    emit('onExceed', files, fileList)
  })

  uploader.value.on(Events.FilesAdded, (fileList) => {
    files.value = fileList
    emit('onFilesAdded', fileList)
  })

  uploader.value.on(Events.FileChange, (file, fileList) => {
    files.value = fileList
    emit('onFileChange', fileList)
  })

  uploader.value.on(Events.FileRemove, (file, fileList) => {
    files.value = fileList
    emit('onFileRemove', file, fileList)
  })

  uploader.value.on(Events.FileProgress, (progress, file, fileList) => {
    emit('onFileProgress', progress, file, fileList)
  })

  uploader.value.on(Events.FileFail, (file, fileList) => {
    files.value = fileList
    emit('onFileFail', file, fileList)
  })

  uploader.value.on(Events.FileUploadFail, (file, fileList) => {
    files.value = fileList
    emit('onFileUploadFail', file, fileList)
  })

  uploader.value.on(Events.FileUploadSuccess, (file, fileList) => {
    files.value = fileList
    emit('onFileUploadSuccess', file, fileList)
  })

  uploader.value.on(Events.FileSuccess, (file, fileList) => {
    files.value = fileList
    emit('onFileSuccess', file, fileList)
  })

  uploader.value.on(Events.AllFileSuccess, (fileList) => {
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
