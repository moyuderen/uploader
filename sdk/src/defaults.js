const options = {
  target: 'https://jsonplaceholder.typicode.com/posts',
  multipart: true, // 是否分片上传，false时单文件上传
  withCredentials: true,
  headers: {},
  data: {},
  concurrency: 6,
  chunkSize: 1024 * 4,
  autoUpload: true,
  name: 'file',
  generateUniqueIdentifier: null,
  successStatuses(xhr) {
    return [200, 201, 202].includes(xhr.status)
  },
  retries: 3,
  retryInterval: 1000,
  merge: (file) => {
    file.path = 'http://baidu.com'
  }
}

const attributes = {
  multiple: true,
  accept: '*'
}

export default {
  options,
  attributes
}
