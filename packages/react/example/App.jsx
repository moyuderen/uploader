import { useEffect, useRef } from 'react'
import Uploader from '../src/index'

function App() {
  const upladerRef = useRef(null)

  useEffect(() => {
    console.log(upladerRef.current)
  }, [upladerRef])

  return (
    <>
      <Uploader ref={upladerRef} defaultFileList={[{ name: 'hah', path: 'http://baidu.com' }]} />
    </>
  )
}

export default App
