import { useContext, useEffect } from 'react'
import { UploaderContext } from '../UploaderContext'
import './style.css'

export function Drop() {
  const uploader = useContext(UploaderContext)

  useEffect(() => {
    if (uploader) {
      uploader.assignDrop(document.querySelector('.tiny-uploader-drop'))
      uploader.assignBrowse(document.querySelector('.tiny-uploader-drop'))
    }
  }, [uploader])

  return <div className="tiny-uploader-drop">drop</div>
}
