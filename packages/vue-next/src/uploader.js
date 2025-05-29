import { CheckStatus } from '@tinyuploader/sdk'

export const uploaderProps = {
  accept: {
    type: String,
    default: '*'
  },
  multiple: {
    type: Boolean,
    default: true
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
    default: 1024 * 1024 * 2
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
      return true
    }
  },
  beforeRemove: {
    type: Function,
    default() {
      return true
    }
  },
  checkFileRequest: {
    type: Function,
    default() {
      return { status: CheckStatus.None }
    }
  },
  requestSucceed: {
    type: Function
  },
  mergeRequest: {
    type: Function
  }
}

export const uploaderEmits = [
  'onExceed',
  'onFilesAdded',
  'onFileChange',
  'onFileRemove',
  'onFileProgress',
  'onFileFail',
  'onFileUploadFail',
  'onFileUploadSuccess',
  'onFileSuccess',
  'onAllFileSuccess'
]
