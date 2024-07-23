import { sleep } from '@/shared'

const options = {
  multipart: true, // TODO: 是否分片上传，false时单文件上传

  /**
   * request
   */
  target: 'https://jsonplaceholder.typicode.com/posts',
  withCredentials: true,
  headers: {},
  data: {},
  concurrency: 6,
  successStatuses(xhr) {
    return [200, 201, 202].includes(xhr.status)
  },
  retries: 3,
  retryInterval: 1000,
  merge: async (file) => {
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
  hasChunkHash: false,
  generateUniqueIdentifier: null
}

const attributes = {
  multiple: true,
  accept: '*'
}

export default {
  options,
  attributes
}
