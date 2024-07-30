---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Uploader'
  text: ''
  tagline: 让上传变的简单
  actions:
    - theme: brand
      text: '@tinyuploader/sdk'
      link: /markdown-examples
    - theme: brand
      text: '@tinyuploader/vue'
      link: /api-examples
    - theme: alt
      text: '@tinyuploader/vuenext'
      link: /api-examples

features:
  - title: 分片上传
    details: 支持将文件切割成多个自定义大小的chunk上传

  - title: 自动重试
    details: 在某个chunk上传失败建立补偿机制，支持配置重试次数和重试间隔

  - title: 手动重试
    details: 自动重试失败后，支持手动触发重试功能

  - title: 并发请求
    details: 支持配置请求的并发数量

  - title: 丰富的配置
    details: 支持文件相关，请求的自定义参数，自定义headers, 是否启用文件的hash计算等
---
