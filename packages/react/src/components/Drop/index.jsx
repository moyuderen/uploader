import { useContext, useEffect } from 'react'
import { UploaderContext } from '../UploaderContext'
import UploadIcon from '../UploadIcon'
import './style.css'

export default function Drop() {
  const uploader = useContext(UploaderContext)

  useEffect(() => {
    if (uploader) {
      uploader.assignDrop(document.querySelector('.tiny-uploader-drop'))
      uploader.assignBrowse(document.querySelector('.tiny-uploader-drop'))
    }
  }, [uploader])

  return (
    <div className="tiny-uploader-drop">
      <UploadIcon size={40} />
      <div style={{ marginTop: '3px' }}>
        <span>Drop file here or</span>
        <span className="tiny-uploader-btn">click to upload </span>
      </div>
    </div>
  )
}
