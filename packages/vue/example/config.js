import { request } from './request.js'

export const customOption = {
  // input 属性相关
  drag: true,
  accept: '*',
  multiple: true,

  // 文件相关
  limit: 4,
  autoUpload: true,
  customGenerateUid: null,
  beforeAdd: (file) => {
    if (file.name.endsWith('.js')) {
      file.setErrorMessage('不允许上传js文件')
      return false
    }
  },
  beforeRemove: (_file) => true,
  addFailToRemove: false, // 默认为false
  chunkSize: 2 * 1024 * 1024, // 2M
  fakeProgress: true,
  withHash: true,
  useWebWoker: false,

  // 上传逻辑相关
  name: 'file',
  action: 'http://localhost:3000/file/upload',
  customRequest: null,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'xxxx-xx-xxxx'
  },
  data: {},
  requestSucceed: (xhr) => [200, 201, 202, 206].includes(xhr.status),
  maxConcurrency: 6,
  maxRetries: 3,
  retryInterval: 1000,
  checkRequest: async ({ hash, name: filename }) => {
    const { data } = await request({
      url: '/check',
      method: 'get',
      params: {
        hash,
        filename,
        status: 'none'
      }
    })

    return data
  },
  mergeRequest: async ({ hash, name: filename }) => {
    const { data } = await request({
      url: '/merge',
      method: 'get',
      params: {
        hash,
        filename,
        status_error: Math.random() > 0.5 ? 'error' : undefined
      }
    })

    return data
  },
  processData: (data, _processType) => data,
  customStatus: {}
}
