<template>
  <div>
    <button @click="clear">取消所有上传</button>
    <button @click="submit">手动提交</button>

    <Uploader
      style="margin-top: 10px"
      ref="uploaderRef"
      action="http://localhost:3000/upload"
      :data="{ user: 'moyuderen' }"
      :headers="{ token: 'xxxxxxxx' }"
      :customStatus="{
        Reading: '读取中',
      }"
      accept="*"
      :fileList="fileList"
      :beforeAdd="beforeAdd"
      :addFailToRemove="true"
      :checkRequest="checkRequest"
      :mergeRequest="merge"
      @onExceed="onExceed"
      @onFileAdded="onFileAdded"
      @onFilesAdded="onFilesAdded"
      @onChange="onChange"
      @onFileRemove="onFileRemove"
      @onFileProgress="onFileProgress"
      @onFileUploadSuccess="onFileUploadSuccess"
      @onSuccess="onSuccess"
      @onFail="onFail"
      @onAllSuccess="onAllSuccess"
      @onPreview="onPreview"
    >
    </Uploader>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: []
    }
  },
  created() {
    setTimeout(() => {
      this.fileList = [
        {
          id: '222',
          name: '哈哈',
          url: 'http://baidu.com'
        }
      ]
    }, 500)
  },
  methods: {
    async checkRequest(file) {
      const { hash, name } = file
      const { data } = await axios.get(`http://localhost:3000/check?hash=${hash}&filename=${name}&status=none`)
      return data
    },
    async merge(file) {
      const { hash, name } = file
      const { data } = await axios.get(`http://localhost:3000/merge?hash=${hash}&filename=${name}`)
      file.url = data.data
      return true
    },
    beforeAdd(file) {
      if(file.name.endsWith('.js')) {
        file.setErrorMessage('不允许上传js文件')
        return false
      }
    },
    clear() {
      this.$refs.uploaderRef.clear()
    },
    submit() {
      this.$refs.uploaderRef.submit()
    },
    onChange(fileList) {
      console.log('change', fileList)
      this.fileList = fileList
    },
    onExceed(files, fileList)  {
      console.log('onExceed', files, fileList)
    },
    onFileAdded(file, fileList)  {
      console.log('onFileAdded', file, fileList)
    },
    onFilesAdded(fileList)  {
      console.log('onFilesAdded', fileList)
    },
    onFileRemove(file, fileList)  {
      console.log('onFileRemove', file, fileList)
    },
    onFileProgress(file, fileList)  {
      console.log('onFileProgress', file.name, file.progress, fileList)
    },
    onFileUploadSuccess() {},
    onSuccess(file, fileList)  {
      console.log('onSuccess', file, fileList)
    },
    onFail(file, fileList)  {
      console.log('onFail', file, fileList)
    },
    onAllSuccess(fileList) {
      console.log('onAllSuccess', fileList)
    },
    onPreview(file) {
      console.log('onPreview', file.name, file.url)
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
