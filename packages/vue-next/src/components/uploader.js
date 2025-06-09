import { CheckStatus } from '@tinyuploader/sdk'

export const uploaderProps = {
  drag: {
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
  defaultFileList: {
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
  headers: [Object, Function],
  data: [Object, Function],
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
    default: 500
  },
  maxConcurrency: {
    type: Number,
    default: 6
  },
  checkRequest: {
    type: Function,
    default: () => ({ status: CheckStatus.None, data: '' })
  },
  mergeRequest: {
    type: Function,
    default() {
      return () => true
    }
  },
  processData: {
    type: Function,
    default: (data) => data
  }
}
