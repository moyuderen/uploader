<template>
  <div class="uploader">
    <uploader-drop v-if="drag" :multiple="multiple" :accept="accept">
      <slot name="drop" v-bind:scope="{ multiple, accept }">
        <upload-icon :size="40" color="#409eff" style="margin-bottom: 6px" />
        <div>
          <span>Drop file here or</span>
          <uploader-btn> click to upload </uploader-btn>
        </div>
      </slot>
    </uploader-drop>

    <div v-else class="trigger">
      <slot name="trigger" v-bind:scope="{ multiple, accept }">
        <button class="tiny__trigger-upload-btn">点击上传</button>
      </slot>
    </div>
    <slot name="files" v-bind:fileList="files">
      <uploader-list :file-list="files">
        <template v-slot="slotProps">
          <uploader-file :file="slotProps.file" @click="clickFile"></uploader-file>
        </template>
      </uploader-list>
    </slot>
  </div>
</template>

<script>
import Uploader from '@tinyuploader/sdk'
import UploaderDrop from './uploader-drop.vue'
import UploaderBtn from './uploader-btn.vue'
import UploaderList from './uploader-list.vue'
import UploaderFile from './uploader-file.vue'
import UploadIcon from './upload-icon.vue'

const Events = Uploader.Events

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
    limit: {
      type: Number,
      default: 10
    },
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    name: {
      type: String,
      default: 'file'
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    action: {
      type: String
    },
    fakeProgress: {
      type: Boolean,
      default: true
    },
    withCredentials: {
      type: Boolean,
      default: true
    },
    headers: Object,
    data: Object,
    withHash: {
      type: Boolean,
      default: true
    },
    computedhashInWorker: {
      type: Boolean,
      default: true
    },
    chunkSize: {
      type: Number,
      default: 1024 * 4
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
    beforeRemove: {
      type: Function,
      default() {
        return () => true
      }
    },
    checkFileRequest: {
      type: Function,
      default() {
        return () => true
      }
    },
    requestSucceed: {
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
    }
  },
  data() {
    return {
      uploader: null,
      files: []
    }
  },
  created() {
    const init = (fileList) => {
      this.uploader = new Uploader({
        ...this._props,
        fileList: fileList
      })

      this.files = this.uploader.fileList

      this.uploader.on(Events.Exceed, (files, fileList) => {
        this.$emit('onExceed', files, fileList)
      })

      this.uploader.on(Events.FilesAdded, (fileList) => {
        this.files = fileList
        this.$emit('onFilesAdded', fileList)
        this.$emit('onChange', fileList, null)
      })

      this.uploader.on(Events.FileRemove, (file, fileList) => {
        this.files = fileList
        this.$emit('onFileRemove', file, fileList)
        this.$emit('onChange', fileList, null)
      })

      this.uploader.on(Events.FileProgress, (progress, file, fileList) => {
        this.$emit('onFileProgress', progress, file, fileList)
      })

      this.uploader.on(Events.FileFail, (file, fileList) => {
        this.files = fileList
        this.$emit('onFileFail', file, fileList)
        this.$emit('onFile', file, fileList)
        this.$emit('onChange', fileList, null)
      })

      this.uploader.on(Events.FileUploadFail, (file, fileList) => {
        this.files = fileList
        this.$emit('onFileUploadFail', file, fileList)
        this.$emit('onFile', file, fileList)
        this.$emit('onChange', fileList, null)
      })

      this.uploader.on(Events.FileUploadSuccess, (file, fileList) => {
        this.files = fileList
        this.$emit('onFileUploadSuccess', file, fileList)
      })

      this.uploader.on(Events.FileSuccess, (file, fileList) => {
        this.files = fileList
        this.$emit('onFileSuccess', file, fileList)
        this.$emit('onSuccess', file, fileList)
        this.$emit('onChange', fileList, null)
      })

      this.uploader.on(Events.AllFileSuccess, (fileList) => {
        this.files = fileList
        this.$emit('onAllFileSuccess', fileList)
        this.$emit('onChange', fileList, null)
      })
    }
    init(this.fileList)
    this.$emit('onChange', this.fileList, null)
  },
  mounted() {
    this.$nextTick(() => {
      !this.drag && this.uploader.assignBrowse(document.querySelector('.trigger'))
    })
  },
  methods: {
    clickFile(file) {
      this.$emit('onClick', file)
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
.tiny__trigger-upload-btn {
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
