export function request(options) {
  const { action, data, headers, name, withCredentials, onSuccess, onFail, onProgress } = options

  const formData = new FormData()

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key])
  })

  let xhr = new XMLHttpRequest()
  xhr.responseType = 'json'
  xhr.withCredentials = withCredentials
  xhr.open('POST', action, true)

  // 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED
  if ('setRequestHeader' in xhr) {
    Object.keys(headers).forEach((key) => {
      xhr.setRequestHeader(key, headers[key])
    })
  }

  xhr.upload.addEventListener('progress', onProgress)
  xhr.addEventListener('load', (e) => onSuccess(e, xhr), false)
  xhr.addEventListener('error', onFail, false)
  xhr.send(formData)

  return {
    abort() {
      xhr.abort()
      xhr = null
    }
  }
}
