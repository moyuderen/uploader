<template>
  <div>
    <uploader
      ref="uploaderRef"
      :chunkSize="1024 * 1024 * 10"
      @onFilesAdded="onFilesAdded"
      @onFileRemove="onFileRemove"
      @onFileProgress="onFileProgress"
      @onFileFail="onFileFail"
      @onFileUploadSuccess="onFileUploadSuccess"
      @onFileSuccess="onFileSuccess"
      @onFileMergeFail="onFileMergeFail"
      @onAllFileSuccess="onAllFileSuccess"
      :merge="merge"
    />
    <button @click="abort">取消所有上传</button>
    <button @click="submit">Submit</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const uploaderRef = ref()

const onFilesAdded = (fileList) => {
  console.log('添加文件成功', fileList)
}

const onFileRemove = (file, fileList) => {
  console.log('删除文件成功', file, fileList)
}

const onFileProgress = (p, file, fileList) => {
  // console.log('上传中', p, file, fileList)
}

const onFileFail = (file, fileList) => {
  console.log('上传失败', file, fileList)
}

const onFileUploadSuccess = (file, fileList) => {
  console.log('上传成功，准备合并', file, fileList)
}

const onFileSuccess = (file, fileList) => {
  console.log('合并成功', file, fileList)
}

const onFileMergeFail = (file, fileList) => {
  console.log('合并文件成功', file, fileList)
}

const onAllFileSuccess = (fileList) => {
  console.log('全部上传成功', fileList)
}

const sleep = () => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve({ url: 'https://google.com' })
    }, 1000)
  })
}
const merge = async (file) => {
  const { url } = await sleep()
  file.url = url
}

const abort = () => {
  uploaderRef.value.abort()
}

const submit = () => {
  uploaderRef.value.submit()
}
</script>
