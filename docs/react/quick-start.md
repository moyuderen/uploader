---
layout: doc
outline: deep
---

# Quick Start

## 安装

```bash
npm i @tinyuploader/react -S
```

## 使用

```jsx
import { useRef } from 'react'
import Uploader from '@tinyuploader/react'
import '@tinyuploader/react/dist/style.css'

function App() {
  const upladerRef = useRef(null)

  const checkFileRequest = async ({ hash, name }) => {
    const response = await fetch('http://localhost:3000/checkFile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'part',
        hash,
        name
      })
    })
    const json = await response.json()
    return json
  }

  const mergeRequest = async ({ hash, name }) => {
    const response = await fetch('http://localhost:3000/merge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hash,
        name
      })
    })
    const json = await response.json()
    if (json.statusCode === 500) {
      throw new Error('服务器错误')
    }
    return json
  }

  const requestSucceed = (xhr) => {
    return xhr.response.data === true
  }

  return (
    <>
      <button onClick={() => upladerRef.current.remove()}>删除所有</button>
      <button onClick={() => upladerRef.current.submit()}>开始上传</button>
      <Uploader
        action="http://localhost:3000/upload"
        accept=".jpg, .png, .json, .dmg"
        ref={upladerRef}
        fileList={[
          { name: 'baidu', path: 'http://baidu.com' },
          { name: 'google', path: 'http://baidu.com' }
        ]}
        limit={4}
        maxRetries={1}
        retryInterval={500}
        maxConcurrency={3}
        data={{ user: 'moyuderen' }}
        headers={{ token: 'xxxxxx' }}
        requestSucceed={requestSucceed}
        checkFileRequest={checkFileRequest}
        mergeRequest={mergeRequest}
      />
    </>
  )
}

export default App
```

## Props 属性

### 基础属性

参考 `@tinyuploader/sdk` 的[**参数配置**](/sdk/props)

### 事件属性

参考 `@tinyuploader/sdk` 的[**回调**](/sdk/callbacks)

#### onExceed

参考 [**Exceed**](/sdk/callbacks#exceed)

#### onFilesAdded

参考 [**FilesAdded**](/sdk/callbacks#filesadded)

#### onFileRemove

参考 [**FileRemove**](/sdk/callbacks#fileremove)

#### onFileProgress

参考 [**FileProgress**](/sdk/callbacks#fileprogress)

#### onFileFail

参考 [**FileFail**](/sdk/callbacks#filefail)

#### onFileUploadFail

参考 [**FileUploadFail**](/sdk/callbacks#fileuploadfail)

#### onFileUploadSuccess

参考 [**FileUploadSuccess**](/sdk/callbacks#fileuploadsuccess)

#### onFileSuccess

参考 [**FileSuccess**](/sdk/callbacks#filesuccess)

#### onAllFileSuccess

参考 [**AllFileSuccess**](/sdk/callbacks#allfilesuccess)

#### onFail

文件上传失败的回调,包括 chunk 失败（文件状态为`uploadFail`），或者 chunk 上传成功但是 merge 失败（文件状态为`fail`）。即`onFileUploadFail`和`FileFail`都会触发`onFail`

`onFail(file, fileList)`

#### onSuccess

文件上传成功的回调，包括上传 chunk 完成，mergr 合并完成，与`onFileSuccess`是一样的

`onSuccess(file, fileList)`

#### onChange

文件列表发生改变时调用

`onChange(fileList, [file])`

#### onClick

点击文件时事件

`onClick(file)`

## Methods

### clear

删除所有文件，并且取消所有上传中的请求

```jsx
<button onClick={() => upladerRef.current.remove()}>Clear</button>
```

### submit

手动触发上传，一般在`autoUpload`为`false`时使用

```jsx
<button onClick={() => upladerRef.current.submit()}>开始上传</button>
```

## Demo 展示

- [线上展示](https://codepen.io/moyuderen/full/MWMmxQZ)

- [具体代码](https://codepen.io/moyuderen/pen/MWMmxQZ)

## [mock 接口](/sdk/questions.html#模拟接口请求)

## [阅读文档](https://moyuderen.github.io/uploader/react/quick-start.html)

## [更新日志](https://github.com/moyuderen/uploader/blob/main/packages/react/CHANGELOG.md)
