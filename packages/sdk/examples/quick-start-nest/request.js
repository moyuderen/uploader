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
  const { action, formData, data, headers, withCredentials, onSuccess, onFail, onProgress } =
    options

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
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

export const checkRequest = async (file) => {
  const data = await fetch(
    `http://localhost:3000/check?hash=${file.hash}&filename=${file.name}&status=none`,
    {}
  )
  return data
}

export const mergeRequest = async (file) => {
  await fetch(`http://localhost:3000/merge?hash=${file.hash}&filename=${file.name}`, {})
  return true
}
