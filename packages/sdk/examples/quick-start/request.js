export const requestSucceed = (response) => {
  const { status } = response
  if (status >= 200 && status < 300) {
    return true
  }
  return false
}

// const BASE_URL = 'http://localhost:3000'
const BASE_URL = 'https://uploader-server-seven.vercel.app/file'

export const customRequest = (options) => {
  const { action, data, query, headers, name, withCredentials, onSuccess, onFail, onProgress } =
    options
  const realData = {
    fileHashCode: data.hash,
    uploadId: data.fileId,
    chunkNumber: data.index + 1,
    chunkSize: data.size,
    totalChunks: data.totalChunks,
    [name]: data[name],
    hash: data.hash,
    filename: data.filename,
    index: data.index,
    // error: '1',
    ...query
  }
  const formData = new FormData()

  Object.keys(realData).forEach((key) => {
    formData.append(key, realData[key])
  })
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  axios({
    url: `${BASE_URL}/upload`,
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

export const checkRequest = async (file, query, headers) => {
  const { data, status } = await axios.get(`${BASE_URL}/check`, {
    params: {
      hash: file.hash,
      filename: file.name,
      status: 'none',
      ...query
      // error: '1'
    },
    headers
  })
  if (status !== 200) {
    throw new Error()
  }
  return data
}

export const mergeRequest = async (file, query, headers) => {
  const { data, status } = await axios.get(`${BASE_URL}/merge`, {
    params: {
      hash: file.hash,
      filename: file.name,
      ...query
      // error: '1'
    },
    headers
  })
  if (status !== 200) {
    throw new Error()
  }
  return data.data
}
