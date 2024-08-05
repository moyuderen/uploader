import { useRef } from 'react'
import Uploader from '../src/index'

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
    return response.json()
  }

  const mergeRequest = async ({ hash, name }) => {
    return fetch('http://localhost:3000/merge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hash,
        name
      })
    })
  }

  const requestSucceed = (xhr) => {
    return xhr.response.data === true
  }

  return (
    <>
      <button onClick={() => upladerRef.current.remove()}>删除所有</button>
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
