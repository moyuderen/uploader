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
const BASE_URL = 'http://localhost:3000/file'
```

## 远程 mock 接口请求

```js
const BASE_URL = 'https://uploader-server-seven.vercel.app/file'
```

## 请求示例

### `check`

```js {1}
axios.get(`${BASE_URL}/check`, {
  params: {
    hash: 'xxxx-xxxx-xxxx',
    filename: 'xxx.png',
    status: 'none' // none, part, waitMerge, success
  }
})
```

::: info 返回结果1：

```json
{
    "code": "00000",
    "statusCode": 200,
    "message": "success",
    "data": {
        "filename": "xxxx-xxxx-xxxx",
        "hash": "xxx.png",
        "status": "none",
        "data": false
    }
}
```

:::

::: details 返回结果2： 文件status为`part`

```json
{
    "code": "00000",
    "statusCode": 200,
    "message": "success",
    "data": {
        "filename": "xxxx-xxxx-xxxx",
        "hash": "xxx.png",
        "status": "part",
        "data": [0, 2, 4, 6, 8, 10] // 已经上传成功chunk的索引值
    }
}
```

:::

::: details 返回结果3： 文件status为`waitMerge`

```json
{
    "code": "00000",
    "statusCode": 200,
    "message": "success",
    "data": {
        "filename": "xxxx-xxxx-xxxx",
        "hash": "xxx.png",
        "status": "waitMerge",
        "data": ""
    }
}
```

:::

::: details 返回结果3： 文件status为`success`

```json
{
    "code": "00000",
    "statusCode": 200,
    "message": "success",
    "data": {
        "filename": "xxxx-xxxx-xxxx",
        "hash": "xxx.png",
        "status": "success",
        "data": "https://baidu.com"
    }
}
```

:::

::: details http状态码异常`500`

```json
{
  "statusCode":500,
  "message":"/file/check mock error !",
  "data":null
}
```

:::

::: details code码异常`00003`

```json
{
    "code": "00003",
    "statusCode": 200,
    "message": "mock error",
    "data": null
}
```

:::

### `upload`

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

::: info 返回结果

```json
{
    "code": "00000",
    "statusCode": 201,
    "message": "success",
    "data": {
        "filename": "xxx.png",
        "hash": "xxxx-xxxx-xxxx",
        "index": "2"
    }
}
```

:::

::: details http状态码异常`500`

```json
{
  "statusCode":500,
  "message":"/file/upload mock error !",
  "data":null
}
```

:::

::: details code码异常`00003`

```json
{
    "code": "00003",
    "statusCode": 200,
    "message": "mock error",
    "data": null
}
```

:::

### `merge`

```js {1}
axios.get(`${BASE_URL}/merge`, {
  params: {
    hash: 'xxxx-xxxx-xxxx',
    filename: 'xxx.png'
  }
})
```

::: info 返回结果

```json
{
    "code": "00000",
    "statusCode": 200,
    "message": "success",
    "data": "http://localhost:3000/static/xxx.png"
}
```

:::

::: details http状态码异常`500`

```json
{
  "statusCode":500,
  "message":"/file/merge mock error !",
  "data":null
}
```

:::

::: details code码异常`00003`

```json
{
    "code": "00003",
    "statusCode": 200,
    "message": "mock error",
    "data": null
}
```

:::

## mock接口异常

> [!TIP]
> 接口参数中添加下面两个参数来模拟接口异常的情况

### status_error

有值时来模拟返回接口错误,返回`http`请求status状态码为`500`; 正常返回为`200`

### code_error

有值时来模拟返回接口错误,返回`http`请求status状态码为`200`, 返回结果code码`00003`; 正常返回`00000`
