<template>
  <div class="uploader">
    <uploader-drop :multiple="multiple" :accept="accept">
      <span style="margin-right: 6px">Drop file here or</span>
      <uploader-btn> click to upload </uploader-btn>
    </uploader-drop>
    <slot v-bind:fileList="files">
      <uploader-list :file-list="files">
        <template v-slot="slotProps">
          <uploader-file :file="slotProps.file"></uploader-file>
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

const Events = Uploader.Events
const Status = Uploader.Status
const File = Uploader.File

export default {
  components: {
    UploaderDrop,
    UploaderBtn,
    UploaderList,
    UploaderFile
  },
  provide() {
    return {
      instance: () => this.uploader
    }
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: '*'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: '*'
    },
    target: {
      type: String
    },
    withCredentials: {
      type: Boolean,
      default: true
    },
    headers: Object,
    data: Object,
    concurrency: {
      type: Number,
      default: 6
    },
    chunkSize: {
      type: Number,
      default: 1024 * 4
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: 'file'
    },
    generateUniqueIdentifier: {
      type: [Function, null],
      default: null
    },
    successStatuses: {
      type: Function
    },
    retries: {
      type: Number,
      default: 3
    },
    retryInterval: {
      type: Number,
      default: 1000
    },
    merge: {
      type: Function
    },
    fileList: {
      type: [],
      default() {
        return []
      }
    }
  },
  data() {
    return {
      uploader: null,
      files: []
    }
  },
  watch: {
    fileList: {
      handler(fileList) {
        this.files = fileList.map((item) => {
          const file = new File(
            {},
            {
              name: 'haha',
              status: Status.Success,
              progress: 1
            }
          )
          console.log(file)
          return file
        })
        this.uploader = new Uploader({
          ...this._props,
          fileList: this.files
        })
        this.uploader.on(Events.FilesAdded, (fileList) => {
          this.files = fileList
          this.$emit('onFilesAdded', fileList)
          this.$emit('onChange', fileList)
        })

        this.uploader.on(Events.AllFileSuccess, (fileList) => {
          this.files = fileList
          this.$emit('onAllFileSuccess', fileList)
          this.$emit('onChange', fileList)
        })

        this.uploader.on(Events.FileUploadSuccess, (file, fileList) => {
          this.files = fileList
          this.$emit('onFileUploadSuccess', file, fileList)
          this.$emit('onChange', fileList)
        })

        this.uploader.on(Events.FileSuccess, (file, fileList) => {
          this.files = fileList
          this.$emit('onFileSuccess', file, fileList)
          this.$emit('onChange', fileList)
        })

        this.uploader.on(Events.FileFail, (file, fileList) => {
          this.files = fileList
          this.$emit('onFileFail', file, fileList)
          this.$emit('onChange', fileList)
        })

        this.uploader.on(Events.FileMergeFail, (file, fileList) => {
          this.files = fileList
          this.$emit('onFileMergeFail', file, fileList)
          this.$emit('onChange', fileList)
        })

        this.uploader.on(Events.FileRemove, (file, fileList) => {
          this.files = fileList
          this.$emit('onFileRemove', file, fileList)
          this.$emit('onChange', fileList)
        })

        this.uploader.on(Events.FileProgress, (progress, file, fileList) => {
          this.files = fileList
          this.$emit('onFileProgress', file, fileList)
        })
      },
      immediate: true
    }
  },
  methods: {
    abort(file) {
      if (file) {
        this.uploader.remove(file)
        return
      }
      this.uploader.remove()
    },
    submit() {
      this.uploader.submit()
    }
  }
}
</script>
