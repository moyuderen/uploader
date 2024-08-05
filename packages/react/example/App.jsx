import { useRef } from 'react'
import Uploader from '../src/index'
// import Uploader from '../dist/tinyuploader-react.js'
// import '../dist/style.css'

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

  const onClick = (file) => {
    console.log(file)
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
        onClick={onClick}
      />
    </>
  )
}

export default App
