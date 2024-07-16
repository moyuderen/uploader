import Uploader from '@tinyuploader/sdk'

export const uploaderProps = {
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
  }
}

export const uploaderEmits = [
  'onFilesAdded',
  'onFileRemove',
  'onFileProgress',
  'onFileFail',
  'onFileUploadSuccess',
  'onFileSuccess',
  'onFileMergeFail',
  'onAllFileSuccess'
]
