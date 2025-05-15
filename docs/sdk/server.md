---
layout: doc
outline: deep
---

# Mock

## 本地模拟接口请求

在仓库 server 目录下有基于`NestJS`模拟的接口

```bash
# 启动sever
pnpm run server:dev
```

```js
const BASE_URL = 'http://localhost:3000'
```

## 远程 mock 接口请求

```js
const BASE_URL = 'https://uploader-server-seven.vercel.app/file'
```

> [!TIP]
> 每个请求中添加`error`参数，则接口会`500`报错，用来模拟请求失败的场景;
> eg: `{error: '1'}`

## 请求示例

1. `check` 接口

```js {1}
axios.get(`${BASE_URL}/check`, {
  params: {
    hash: 'xxxx-xxxx-xxxx',
    filename: 'xxx.png',
    status: 'none' // none, part, waitMerge, success
  }
})
```

2. `upload`接口

```js {10}
const data = {
  hash: 'xxxx-xxxx-xxxx',
  filename: 'xxx.png',
  index: 2,
  file: binary
}
const formData = new FormData()
Object.entries(data).forEach(([key, value]) => formData.append(key, value))

axios.post(`${BASE_URL}/upload`, { data: formData })
```

3. `merge`接口

```js {1}
axios.get(`${BASE_URL}/merge`, {
  params: {
    hash: 'xxxx-xxxx-xxxx',
    filename: 'xxx.png'
  }
})
```
