<template>
  <div class="tiny-uploader">
    <uploader-drop v-if="drag">
      <slot name="drop" v-bind:scope="{ multiple, accept }">
        <upload-icon :size="40" color="#409eff" style="margin-bottom: 6px" />
        <div>
          <span>Drop file here or</span>
          <uploader-btn> click to upload </uploader-btn>
        </div>
      </slot>
    </uploader-drop>

    <div v-else class="tiny-uploader-trigger">
      <slot name="trigger" v-bind:scope="{ multiple, accept }">
        <button class="tiny-uploader__trigger-upload-btn">Click to Upload</button>
      </slot>
    </div>
    <slot name="files" v-bind:fileList="files">
      <uploader-list :file-list="files">
        <template v-slot="slotProps">
          <uploader-file :customStatus="customStatus" :file="slotProps.file" @click="clickFile"></uploader-file>
        </template>
      </uploader-list>
    </slot>
  </div>
</template>

<script>
import Uploader, { Callbacks } from '@tinyuploader/sdk'
import UploaderDrop from './uploader-drop.vue'
import UploaderBtn from './uploader-btn.vue'
import UploaderList from './uploader-list.vue'
import UploaderFile from './uploader-file.vue'
import UploadIcon from './upload-icon.vue'

export default {
  components: {
    UploaderDrop,
    UploaderBtn,
    UploaderList,
    UploaderFile,
    UploadIcon
  },
  provide() {
    return {
      instance: () => this.uploader
    }
  },
  props: {
    drag: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: '*'
    },
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    limit: {
      type: Number,
      default: 10
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    customGenerateUid: {
      type: [Function, null],
      default: null
    },
    beforeAdd: {
      type: Function,
      default() {
        return () => true
      }
    },
    addFailToRemove: {
      type: Boolean,
      default: true
    },
    beforeRemove: {
      type: Function,
      default() {
        return () => true
      }
    },
    chunkSize: {
      type: Number,
      default: 1024 * 1024 * 2
    },
    fakeProgress: {
      type: Boolean,
      default: true
    },
    withHash: {
      type: Boolean,
      default: true
    },
    useWebWoker: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'file'
    },
    action: {
      type: String
    },
    withCredentials: {
      type: Boolean,
      default: true
    },
    headers: Object,
    data: Object,
    customRequest: {
      type: [Function, null],
      default: null
    },
    requestSucceed: {
      type: Function,
      default() {
        return (response) => [200, 201, 202, 206].includes(response.status)
      }
    },
    maxRetries: {
      type: Number,
      default: 3
    },
    retryInterval: {
      type: Number,
      default: 1000
    },
    maxConcurrency: {
      type: Number,
      default: 6
    },
    checkRequest: {
      type: Function,
      default() {
        return () => true
      }
    },
    mergeRequest: {
      type: Function,
      default() {
        return () => true
      }
    },
    processData: {
      type: Function,
      default: data => data
    },
    customStatus: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      uploader: null,
      files: []
    }
  },
  watch: {
    fileList(newVal) {
      if(this.uploader && newVal.length > 0) {
        this.uploader.setDefaultFileList(newVal)
      }
    }
  },
  created() {
    this.uploader = new Uploader({
      // input 属性相关
      accept: this.accept,
      multiple: this.multiple,

      // 文件相关
      // fileList,
      limit: this.limit,
      autoUpload: this.autoUpload,
      customGenerateUid: this.customGenerateUid,
      beforeAdd: this.beforeAdd,
      beforeRemove: this.beforeRemove,
      addFailToRemove: this.addFailToRemove,
      chunkSize: this.chunkSize,
      fakeProgress: this.fakeProgress,
      withHash: this.withHash,
      useWebWoker: this.useWebWoker,

      // 上传逻辑相关
      name: this.name,
      action: this.action,
      customRequest: this.customRequest,
      withCredentials: this.withCredentials,
      headers: this.headers,
      data: this.data,
      processData: this.processData,
      requestSucceed: this.requestSucceed,
      maxConcurrency: this.maxConcurrency,
      maxRetries: this.maxRetries,
      retryInterval: this.retryInterval,
      checkRequest: this.checkRequest,
      mergeRequest: this.mergeRequest,
    })

    this.uploader.on(Callbacks.FileChange, (file, fileList) => {
      console.log('file change', file, fileList)
      this.files = fileList
    })

    this.uploader.on(Callbacks.Exceed, (files, fileList) => {
      this.$emit('onExceed', files, fileList)
    })

    this.uploader.on(Callbacks.FileAdded, (file, fileList) => {
      this.$emit('onFileAdded', file, fileList)
    })

    this.uploader.on(Callbacks.FileAddFail, (file, fileList) => {
      this.$emit('onFail', file, fileList)
    })

    this.uploader.on(Callbacks.FilesAdded, (fileList) => {
      this.$emit('onFilesAdded', fileList)
    })

    this.uploader.on(Callbacks.FileRemove, (file, fileList) => {
      this.$emit('onFileRemove', file, fileList)
    })

    this.uploader.on(Callbacks.FileProgress, (file, fileList) => {
      this.$emit('onFileProgress', file, fileList)
    })

    this.uploader.on(Callbacks.FileUploadSuccess, (file, fileList) => {
      this.$emit('onFileUploadSuccess', file, fileList)
    })

    this.uploader.on(Callbacks.FileUploadFail, (file, fileList) => {
      this.$emit('onFail', file, fileList)
    })

    this.uploader.on(Callbacks.FileFail, (file, fileList) => {
      this.$emit('onFail', file, fileList)
    })

    this.uploader.on(Callbacks.AllFileSuccess, (fileList) => {
      this.$emit('onAllFileSuccess', fileList)
    })

    this.uploader.setDefaultFileList(this.fileList)
  },
  mounted() {
    this.$nextTick(() => {
      !this.drag && this.uploader.assignBrowse(document.querySelector('.tiny-uploader-trigger'))
    })
  },
  methods: {
    clickFile(file) {
      this.$emit('onPreview', file)
    },
    clear() {
      this.uploader.clear()
    },
    submit() {
      this.uploader.submit()
    }
  }
}
</script>

<style>
.tiny-uploader__trigger-upload-btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  -webkit-appearance: none;
  -webkit-user-select: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 3px;
  color: #fff;
  background-color: #409eff;
  border: 1px solid #409eff;
}
</style>
