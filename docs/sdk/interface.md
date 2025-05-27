# 接口类型

## DefaultFile {#default-file}

```typescript
type DefaultFile = {
  id: string
  name: string
  url: string
}
```

## RequestData 上传接口默认参数 {request-data}

```ts
type RequestData = {
  [name]: blob // chunk二进制数据， name是配置中的名称，默认是file
  hash: string // 文件hash
  id: string // chunk id
  fileId: string // file id
  index: number // 从0开始
  filename: string
  size: number
  totalSize: number
  totalChunks: number
}
```

## Request {#request}

```ts
export function request(options) {
  const {
    method = 'POST',
    withCredentials = true,
    responseType = 'json',
    action,
    data,
    query,
    headers,
    name,
    onSuccess,
    onFail,
    onProgress
  } = options

  let xhr = new XMLHttpRequest()
  xhr.responseType = responseType
  xhr.withCredentials = withCredentials
  xhr.open(method, action, true)

  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => formData.append(key, value))

  // 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED
  if ('setRequestHeader' in xhr) {
    Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))
  }

  xhr.addEventListener('timeout', () => onFail(new Error('Request timed out'), xhr))
  xhr.upload.addEventListener('progress', onProgress)
  xhr.addEventListener('error', onFail, false)
  xhr.addEventListener('readystatechange', (e) => {
    if (xhr.readyState !== 4) return
    if (xhr.status < 200 || xhr.status >= 300) {
      onFail(new Error(`xhr: status === ${xhr.status}`), xhr)
      return
    }
    onSuccess(e, xhr)
  })
  xhr.send(formData)

  return {
    abort() {
      xhr.abort()
      xhr = null
    }
  }
}
```

## CustomRequestOption {#custom-request-option}

```ts
type CustomRequestOption = {
  action: string
  name: string
  withCredentials: boolean
  headers: object
  data: RequestData
  query: object
  onSuccess: (e, response) => void
  onFail: (e) => void
  onProgress: (e) => void
}
```
