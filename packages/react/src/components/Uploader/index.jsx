import { useEffect, useState, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { UploaderContext } from '../UploaderContext'
import { create, Events } from '@tinyuploader/sdk'
import { Drop } from '../Drop'

const noop = () => {}

const Uploader = forwardRef((props, ref) => {
  const {
    defaultFileList = [],
    onInited = noop,
    onExceed = noop,
    onFilesAdded = noop,
    onFileRemove = noop,
    onFileProgress = noop,
    onFileFail = noop,
    onFileUploadFail = noop,
    onFileUploadSuccess = noop,
    onFileSuccess = noop,
    onAllFileSuccess = noop,
    onFile = noop,
    onSuccess = noop,
    onChange = noop
  } = props
  const [uploader, setUploader] = useState(null)
  const [files, setFiles] = useState([])

  const createInstance = () => {
    const instance = create({
      fileList: defaultFileList
    })

    setFiles([...instance.fileList])

    instance.on(Events.Inited, (fileList) => {
      setFiles([...fileList])
      onInited(fileList)
    })

    instance.on(Events.Exceed, (files, fileList) => {
      onExceed(files, fileList)
    })

    instance.on(Events.FilesAdded, (fileList) => {
      console.log(fileList)
      setFiles([...fileList])
      onFilesAdded(fileList)
      onChange(fileList, null)
    })

    instance.on(Events.FileRemove, (file, fileList) => {
      setFiles([...fileList])
      onFileRemove(file, fileList)
      onChange(fileList, null)
    })

    instance.on(Events.FileProgress, (progress, file, fileList) => {
      setFiles([...fileList])
      onFileProgress(progress, file, fileList)
    })

    instance.on(Events.FileFail, (file, fileList) => {
      setFiles([...fileList])
      onFileFail(file, fileList)
      onFile(file, fileList)
      onChange(fileList, null)
    })

    instance.on(Events.FileUploadFail, (file, fileList) => {
      setFiles([...fileList])
      onFileUploadFail(file, fileList)
      onFile(file, fileList)
      onChange(fileList, null)
    })

    instance.on(Events.FileUploadSuccess, (file, fileList) => {
      setFiles([...fileList])
      onFileUploadSuccess(file, fileList)
    })

    instance.on(Events.FileSuccess, (file, fileList) => {
      setFiles([...fileList])
      onFileSuccess(file, fileList)
      onSuccess(file, fileList)
      onChange(fileList, null)
    })

    instance.on(Events.AllFileSuccess, (fileList) => {
      setFiles([...fileList])
      onAllFileSuccess(fileList)
      onChange(fileList, null)
    })

    return instance
  }

  useEffect(() => {
    setUploader(createInstance())
  }, [])

  return (
    <UploaderContext.Provider value={uploader}>
      <Drop />
      <div ref={ref}>
        {files.map((file) => {
          return (
            <div key={file.uid}>
              {file.name}
              {file.status}
              {file.progress}
            </div>
          )
        })}
      </div>
    </UploaderContext.Provider>
  )
})

Uploader.displayName = 'Uploader'

Uploader.propTypes = {
  defaultFileList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string
    })
  ),
  onInited: PropTypes.func,
  onExceed: PropTypes.func,
  onFilesAdded: PropTypes.func,
  onFileRemove: PropTypes.func,
  onFileProgress: PropTypes.func,
  onFileFail: PropTypes.func,
  onFileUploadFail: PropTypes.func,
  onFileUploadSuccess: PropTypes.func,
  onFileSuccess: PropTypes.func,
  onAllFileSuccess: PropTypes.func,
  onFile: PropTypes.func,
  onSuccess: PropTypes.func,
  onChange: PropTypes.func
}

export default Uploader
