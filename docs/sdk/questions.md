---
layout: doc
outline: deep
---

# 问题

## 模拟接口请求

在仓库 server 目录下有基于`NestJS`模拟的接口

```bash
# 启动sever
pnpm run server:dev
```

1. check 接口

```js
axios.get('http://localhost:3000/check', {
  params: {
    hash: 'xxxx-xxxx-xxxx',
   filename: 'xxx.png',
    status: 'none' // none, part, waitMerge, success
  },
})
```

2. `upload`接口

```js
const data = {
  hash: 'xxxx-xxxx-xxxx',
  filename: 'xxx.png',
  index: 2,
  file: (blob)
}
const formData = new FormData()
Object.entries(data).forEach(([key, value]) => formData.append(key, value))

axios.post('http://localhost:3000/upload', { data: formData })

```

2. `merge`接口

```js
axios.get('http://localhost:3000/merge', {
  params: {
    hash: 'xxxx-xxxx-xxxx',
   filename: 'xxx.png',
  },
})
```
