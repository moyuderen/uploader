import { sleep } from '@/shared'

export const defaults = {
  multipart: true, // TODO: 是否分片上传，false时单文件上传

  /**
   * request
   */
  action: 'https://jsonplaceholder.typicode.com/posts',
  withCredentials: true,
  headers: {},
  data: {},
  maxConcurrency: 6,
  requestSucceed(xhr) {
    return [200, 201, 202].includes(xhr.status)
  },
  retries: 3,
  retryInterval: 1000,
  mergeRequest: async (file) => {
    await sleep(5000)
    file.path = 'http://baidu.com'
  },

  /**
   * file option
   */
  chunkSize: 1024 * 4,
  autoUpload: true,
  name: 'file',
  limit: 10,
  withHash: true,
  computedHashWorker: true,
  fakeProgress: true,
  customGenerateUid: null,
  beforeAdd(file) {
    return true
  },
  beforeRemove(file) {
    return true
  },

  /**
   * input
   */
  multiple: true,
  accept: '*'
}
