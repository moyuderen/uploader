# Quick Start

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
