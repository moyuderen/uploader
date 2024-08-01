# Quick Start

## 安装

```bash
npm i @tinyuploader/sdk -S
```

## 使用

使用类创建实例

```javascript
import Uploader from '@tinyuploader/sdk'

const uploader = new Uploader({
  action: 'https://jsonplaceholder.typicode.com/posts'
})

// 绑定上传的dom节点
uploader.assignBrowse(document.querySelector('.uploader-btn'))
```

使用暴露的 create 函数创建

```javascript
import { create } from '@tinyuploader/sdk'

const uploader = create({
  action: 'https://jsonplaceholder.typicode.com/posts'
})

// 绑定上传的dom节点
uploader.assignBrowse(document.querySelector('.uploader-btn'))
```

## Demo 展示

- [线上展示](https://codepen.io/moyuderen/full/KKjaqJK)

- [具体代码](https://codepen.io/moyuderen/pen/KKjaqJK)

## [mock 接口](/sdk/questions.html#模拟接口请求)

## [阅读文档](https://moyuderen.github.io/uploader/sdk/quick-start.html)

## [更新日志](https://github.com/moyuderen/uploader/blob/main/packages/sdk/CHANGELOG.md)
