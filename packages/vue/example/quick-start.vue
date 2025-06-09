<template>
  <div>
    <div style="margin-bottom: 10px">
      <input v-model="name" placeholder="自定义参数" />
      <button @click="clear">取消所有上传</button>
      <button v-if="option.autoUpload === false" @click="submit">手动提交</button>
    </div>

    <Uploader
      ref="uploaderRef"
      class="tiny-uploader"
      v-bind="option"
      :defaultFileList="defaultFileList"
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
    >
    </Uploader>
  </div>
</template>

<script>
import { customOption } from './config'

export default {
  data() {
    return {
      name: 'moyuderen',
      defaultFileList: [],
      fileList: []
    }
  },
  computed: {
    option() {
      const { data, ...option } = customOption
      return {
        ...option,
        data: { name: this.name }
      }
    }
  },
  created() {
    setTimeout(() => {
      this.defaultFileList = [
        {
          id: '222',
          name: '哈哈',
          url: 'http://baidu.com'
        }
      ]
    }, 500)
  },
  methods: {
    clear() {
      this.$refs.uploaderRef.clear()
    },
    submit() {
      this.$refs.uploaderRef.submit()
    },
    onChange(file, fileList) {
      this.fileList = fileList
    },
    onExceed(selectedFiles) {
      console.log('onExceed', selectedFiles)
    },
    onFileAdded(file, fileList) {
      console.log('onFileAdded', file, fileList)
    },
    onFilesAdded(fileList) {
      console.log('onFilesAdded', fileList)
    },
    onFileRemove(file, fileList) {
      console.log('onFileRemove', file, fileList)
    },
    onFileProgress(file, fileList) {
      // console.log('onFileProgress', file.name, file.progress, fileList)
    },
    onFileUploadSuccess() {},
    onSuccess(file, fileList) {
      console.log('onSuccess', file, fileList)
    },
    onFail(file, fileList) {
      console.log('onFail', file, fileList)
    },
    onAllFileSuccess(fileList) {
      console.log('onAllFileSuccess', fileList)
    },
    onClick(file) {
      console.log('onPreview', file.name, file.url)
    }
  }
}
</script>

<style lang="scss">
.tiny-uploader {
  --tiny-color-primary: #1dce9f;
}
</style>

