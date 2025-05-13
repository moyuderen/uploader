const queryString = (object) => {
  let str = ''
  for (const [key, value] of Object.entries(object)) {
    str += `&${key}=${value}`
  }
  return str
}

export const requestSucceed = (response) => {
  const { status } = response
  if (status >= 200 && status < 300) {
    return true
  }
  return false
}

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
    ...query
  }
  const formData = new FormData()

  Object.keys(realData).forEach((key) => {
    formData.append(key, realData[key])
  })
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  axios({
    url: 'http://localhost:3000/upload',
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

export const checkRequest = async (file, query) => {
  const params = {
    hash: file.hash,
    filename: file.name,
    status: 'none',
    ...query
  }
  const data = await fetch(`http://localhost:3000/check?${queryString(params)}`)

  return await data.json()
}

export const mergeRequest = async (file, query) => {
  const params = {
    hash: file.hash,
    filename: file.name,
    ...query
  }
  const data = await fetch(`http://localhost:3000/merge?${queryString(params)}`)
  const json = await data.json()
  return json.data
}
