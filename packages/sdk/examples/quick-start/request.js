import { CheckStatus } from '../../src/core/constants'

const sleep = (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export const requestSucceed = (response) => {
  const { status } = response
  if (status >= 200 && status < 300) {
    return true
  }
  return false
}

export const customRequest = (options) => {
  const { action, data, headers, name, withCredentials, onSuccess, onFail, onProgress } = options
  const realData = {
    fileHashCode: data.hash,
    uploadId: data.fileId,
    chunkNumber: data.index + 1,
    chunkSize: data.size,
    totalChunks: data.totalChunks,
    [name]: data[name]
  }

  const formData = new FormData()
  Object.keys(realData).forEach((key) => {
    formData.append(key, realData[key])
  })
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  axios({
    url: action,
    method: 'POST',
    data: formData,
    headers: headers,
    cancelToken: source.token,
    withCredentials: withCredentials,
    onUploadProgress: onProgress
  })
    .then((res) => {
      onSuccess(action, res)
    })
    .catch((e) => {
      onFail(e)
    })

  return {
    abort() {
      source.cancel('Operation canceled by the user.')
    }
  }
}

export const checkRequest = async (file) => {
  const data = await fetch(`/api/check?hash=${file.hash}&filename=${file.name}`, {})
  return {
    status: CheckStatus.Part,
    data: [0, 2, 4, 6, 8, 10] // data是已经上传成功chunk的chunkIndex
  }
}

export const mergeRequest = async (file) => {
  await fetch(`/api/merge?hash=${file.hash}&filename=${file.name}`, {})
  return true
}
