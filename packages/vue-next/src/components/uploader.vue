<template>
  <div class="uploader">
    <uploader-drop :multiple="props.multiple" :accept="props.accept">
      <span style="margin-right: 6px">Drop file here or</span>
      <uploader-btn> click to upload </uploader-btn>
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
import Uploader from '@tinyuploader/sdk'
import uploaderDrop from './uploader-drop.vue'
import uploaderBtn from './uploader-btn.vue'
import uploaderList from './uploader-list.vue'
import uploaderFile from './uploader-file.vue'
import { uploaderProps, uploaderEmits } from './uploader.js'

const Status = Uploader.Status
const Events = Uploader.Events

const props = defineProps(uploaderProps)
const emit = defineEmits(uploaderEmits)

const uploader = ref(null)
const files = ref([])

uploader.value = new Uploader(props)
provide('uploader', uploader)

onMounted(() => {
  uploader.value.on(Events.FilesAdded, (fileList) => {
    files.value = fileList
    emit('onFilesAdded', fileList)
  })

  uploader.value.on(Events.AllFileSuccess, (fileList) => {
    files.value = fileList
    emit('onAllFileSuccess', fileList)
  })

  uploader.value.on(Events.FileUploadSuccess, (file, fileList) => {
    files.value = fileList
    emit('onFileUploadSuccess', file, fileList)
  })

  uploader.value.on(Events.FileSuccess, (file, fileList) => {
    files.value = fileList
    emit('onFileSuccess', file, fileList)
  })

  uploader.value.on(Events.FileFail, (file, fileList) => {
    files.value = fileList
    emit('onFileFail', file, fileList)
  })

  uploader.value.on(Events.FileMergeFail, (file, fileList) => {
    files.value = fileList
    emit('onFileMergeFail', file, fileList)
  })

  uploader.value.on(Events.FileRemove, (file, fileList) => {
    files.value = fileList
    emit('onFileRemove', file, fileList)
  })

  uploader.value.on(Events.FileProgress, (progress, file, fileList) => {
    emit('onFileProgress', progress, file, fileList)
  })
})

const abort = (id) => {
  if (id) {
    uploader.value.remove(id)
    return
  }
  uploader.value.remove()
}

const submit = () => {
  uploader.value.submit()
}

defineExpose({
  abort,
  submit
})
</script>
