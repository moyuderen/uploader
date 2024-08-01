# tinyuploader

## 功能

目前之前的功能：`大文件分片`、`自动重试`、 `手动重试`、 `并发请求`、`计算文件 hash`、`断点续传，秒传`、`合并请求`

## 多种使用方式

- `@tinyuplpader/sdk`不依赖框架直接使用

- `@tinyuplpader/vue`基于 vue2.x 版本的组件

- `@tinyuplpader/vuenext`基于 vue3.x 版本的组件

## 安装

```bash
npm i @tinyuploader/sdk -S
```

## 使用

```javascript
import Uploader from '@tinyuploader/sdk'

const uploader = new Uploader({
  action: 'https://jsonplaceholder.typicode.com/posts'
})

// 绑定上传的dom节点
uploader.assignBrowse(document.querySelector('.uploader-btn'))
```

## Demo 展示

- [线上展示](https://codepen.io/moyuderen/full/KKjaqJK)

- [具体代码](https://codepen.io/moyuderen/pen/KKjaqJK)

> [@tinyuploader/sdk 文档](https://moyuderen.github.io/uploader/sdk/quick-start.html)
>
> [@tinyuploader/vue 文档](https://moyuderen.github.io/uploader/vue/quick-start.html)
>
> [@tinyuploader/vuenext 文档](https://moyuderen.github.io/uploader/vuenext/quick-start.html)
