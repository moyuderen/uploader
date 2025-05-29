<template>
  <div>
    <button @click="clear">Clear</button>
    <button @click="submit">Submit</button>
  </div>
  <Uploader
    v-bind="customOption"
    :defaultFileList="defaultFileList"
    ref="uploaderRef"
    @onExceed="onExceed"
    @onFileAdded="onFileAdded"
    @onFilesAdded="onFilesAdded"
    @onChange="onChange"
    @onFileRemove="onFileRemove"
    @onFileProgress="onFileProgress"
    @onFileUploadSuccess="onFileUploadSuccess"
    @onSuccess="onSuccess"
    @onFail="onFail"
    @onAllFileSuccess="onAllFileSuccess"
    @onClick="onClick"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { customOption } from './config'

const uploaderRef = ref()
const defaultFileList = ref([])
const fileList = ref([])

onMounted(() => {
  setTimeout(() => {
    defaultFileList.value = [{ name: 'default.png', url: 'https://baidu.com', id: '1' }]
  }, 300)
})
const onChange = (_file, list) => {
  fileList.value = list
}
const onExceed = (selectedFiles) => {
  console.log('onExceed', selectedFiles)
}
const onFileAdded = (file, fileList) => {
  console.log('onFileAdded', file, fileList)
}
const onFilesAdded = (fileList) => {
  console.log('onFilesAdded', fileList)
}
const onFileRemove = (file, fileList) => {
  console.log('onFileRemove', file, fileList)
}
const onFileProgress = (file, _fileList) => {
  // console.log('onFileProgress', file.name, file.progress)
}
const onFileUploadSuccess = () => {}
const onSuccess = (file, fileList) => {
  console.log('onSuccess', file, fileList)
}
const onFail = (file, fileList) => {
  console.log('onFail', file, fileList)
}
const onAllFileSuccess = (fileList) => {
  console.log('onAllFileSuccess', fileList)
}
const onClick = (file) => {
  console.log('onPreview', file.name, file.url)
}
const clear = () => uploaderRef.value.clear()
const submit = () => uploaderRef.value.submit()
</script>
