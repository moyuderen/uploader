const { toString } = Object.prototype

const typeOfTest = (value, type) => {
  const str = toString.call(value)
  return str.slice(8, -1).toLowerCase() === type
}

export const isBlob = (thing) => {
  return typeOfTest(thing, 'blob')
}

const logger = (e) => {
  console.warn('接口reject', e)
}

const disposeJsonResponse = (response, responseData) => {
  const {
    config: { rawResponse },
    data: { code }
  } = response

  const data = responseData || response.data

  if (code === '00000') {
    return rawResponse ? response : data
  }
  logger(data)
  return Promise.reject(data)
}

const disposeBlobResponse = async (response) => {
  const {
    config: { rawResponse },
    data
  } = response

  if (!data.text) {
    logger(data)
    return Promise.reject(data)
  }

  try {
    const blobString = await data.text()
    const responseData = JSON.parse(blobString)
    return disposeJsonResponse(response, responseData)
  } catch {
    return rawResponse ? response : data
  }
}

const request = axios.create({
  baseURL: 'http://localhost:3000/file',
  timeout: 10000,
  withCredentials: true
})

request.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  function (response) {
    const { data } = response
    return isBlob(data) ? disposeBlobResponse(response) : disposeJsonResponse(response)
  },
  function (error) {
    logger(error)
    return Promise.reject(error)
  }
)

export { request }
