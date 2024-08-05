import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { UploaderContext } from '../UploaderContext'
import { create, Events } from '@tinyuploader/sdk'
import Drop from '../Drop'
import FileList from '../FileList'
import FileItem from '../FileItem'

const noop = () => {}

const Uploader = forwardRef((props, ref) => {
  const {
    fileList = [],
    accept = '*',
    multiple = true,
    chunkSize = 1024 * 1024 * 2,
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
    onChange = noop,
    onClick = noop
  } = props
  const [uploader, setUploader] = useState()
  const [files, setFiles] = useState([])

  const createInstance = () => {
    const instance = create({
      fileList: fileList,
      ...props,
      accept,
      multiple,
      chunkSize
    })

    setFiles([...instance.fileList])
    instance.on(Events.FileChange, (file, fileList) => {
      setFiles([...fileList])
    })

    instance.on(Events.Exceed, (files, fileList) => {
      setFiles([...fileList])
      onExceed(files, fileList)
    })

    instance.on(Events.FilesAdded, (fileList) => {
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
      // setFiles([...fileList])
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

  useImperativeHandle(
    ref,
    () => {
      return {
        remove() {
          uploader.remove()
        },
        submit() {
          uploader.submit()
        }
      }
    },
    [uploader]
  )

  return (
    <UploaderContext.Provider value={uploader}>
      <div ref={ref}>
        <Drop />
        {uploader && (
          <FileList fileList={files}>
            <FileItem onClick={onClick} />
          </FileList>
        )}
      </div>
    </UploaderContext.Provider>
  )
})

Uploader.displayName = 'Uploader'

Uploader.propTypes = {
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  limit: PropTypes.number,
  fileList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string
    })
  ),
  name: PropTypes.string,
  autoUpload: PropTypes.bool,
  action: PropTypes.string,
  fakeProgress: PropTypes.bool,
  withCredentials: PropTypes.bool,
  headers: PropTypes.object,
  data: PropTypes.object,
  withHash: PropTypes.bool,
  computedhashInWorker: PropTypes.bool,
  chunkSize: PropTypes.number,
  maxRetries: PropTypes.number,
  retryInterval: PropTypes.number,
  maxConcurrency: PropTypes.number,
  customGenerateUid: PropTypes.oneOf([null, PropTypes.func]),
  beforeAdd: PropTypes.func,
  beforeRemove: PropTypes.func,
  checkFileRequest: PropTypes.func,
  requestSucceed: PropTypes.func,
  mergeRequest: PropTypes.func,
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
  onChange: PropTypes.func,
  onClick: PropTypes.func
}

export default Uploader
