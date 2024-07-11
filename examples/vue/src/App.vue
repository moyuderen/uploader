<template>
  <div id="app">
    <Uploader
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

<script>
export default {
  methods: {
    onFilesAdded(fileList) {
      console.log('添加文件成功', fileList)
    },
    onFileRemove(file, fileList) {
      console.log('删除文件成功', file, fileList)
    },
    onFileProgress(p, file, fileList) {
      // console.log('上传中', p, file, fileList)
    },
    onFileFail(file, fileList) {
      console.log('上传失败', file, fileList)
    },
    onFileUploadSuccess(file, fileList) {
      console.log('上传成功，准备合并', file, fileList)
    },
    onFileSuccess(file, fileList) {
      console.log('合并成功', file, fileList)
    },
    onFileMergeFail(file, fileList) {
      console.log('合并文件失败', file, fileList)
    },
    onAllFileSuccess(fileList) {
      console.log('全部上传成功', fileList)
    },
    async merge(file) {
      const sleep = () => {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            clearTimeout(timer)
            resolve({ url: 'https://google.com' })
          }, 1000)
        })
      }
      const { url } = await sleep()
      file.url = url
    },
    abort() {
      this.$refs.uploaderRef.abort()
    },
    submit() {
      this.$refs.uploaderRef.submit()
    }
  }
}
</script>

<style scoped>
html,
body {
  width: 100%;
  height: 100%;
}
</style>
