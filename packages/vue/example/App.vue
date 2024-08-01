<template>
  <div>
    <h2>Dev pkg vue2</h2>

    <button @click="clear">取消所有上传</button>
    <button @click="submit">手动提交</button>
    <button @click="viewFileList">查看文件列表</button>

    <Uploader
      style="margin-top: 10px"
      ref="uploaderRef"
      action="http://localhost:3000/upload"
      :data="{ user: 'moyuderen' }"
      :headers="{ token: 'xxxxxxxx' }"
      accept=".jpg,.json,.png,.dmg"
      :fileList="fileList"
      :chunkSize="1024 * 1024 * 10"
      :checkFileRequest="checkFileRequest"
      :mergeRequest="merge"
      @onExceed="onExceed"
      @onFilesAdded="onFilesAdded"
      @onFileProgress="onProgress"
      @onFileRemove="onRemove"
      @onFail="onFail"
      @onSuccess="onSuccess"
      @onAllFileSuccess="onAllFileSuccess"
      @onChange="onChange"
      @onClick="onClick"
    >
    </Uploader>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [
        {
          name: '哈哈',
          path: 'http://baidu.com'
        }
      ]
    }
  },
  methods: {
    onExceed() {
      console.log('超出最大上传次数了')
    },
    onFilesAdded(fileList) {
      console.log('添加文件成功', fileList)
    },
    onRemove(file, fileList) {
      console.log('删除文件成功', file, fileList)
    },
    onProgress(p, file, fileList) {
      // console.log('上传中', p, file, fileList)
    },
    onFail(file, fileList) {
      console.log('上传失败', file, fileList)
    },
    onSuccess(file, fileList) {
      console.log('上传成功', file, fileList)
    },
    onAllFileSuccess(fileList) {
      console.log('全部上传成功', fileList)
    },
    onChange(fileList) {
      console.log('change', fileList)

      this.fileList = fileList
    },
    onClick(file) {
      console.log(file)
    },

    async checkFileRequest(file) {
      const { hash, name } = file
      const { data } = await axios.post('http://localhost:3000/checkFile', {
        hash,
        name,
        status: 'none'
      })
      return data
    },
    async merge(file) {
      const { hash, name } = file
      const { data } = await axios.post('http://localhost:3000/merge', { hash, name })
      file.path = data.data
    },
    clear() {
      this.$refs.uploaderRef.clear()
    },
    submit() {
      this.$refs.uploaderRef.submit()
    },
    viewFileList() {
      console.log(this.fileList)
    }
  }
}
</script>

<style lang="scss" scoped>
html,
body {
  width: 100%;
  height: 100%;
}

::v-deep .tiny-uploader-btn {
  color: cornflowerblue;
}
</style>
