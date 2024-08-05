import { useCallback, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Status } from '@tinyuploader/sdk'
import FileIcon from '../FileIcon'
import PlayIcon from '../PlayIcon'
import PauseIcon from '../PauseIcon'
import RetryIcon from '../RetryIcon'
import RemoveIcon from '../RemoveIcon'
import { UploaderContext } from '../UploaderContext'
import './style.css'

export default function FileItem({ file }) {
  const uploader = useContext(UploaderContext)
  const [progressWidth, setProgressWidth] = useState(0)

  useEffect(() => {
    setProgressWidth(`${file.progress * 100}%`)
  }, [file.progress])

  const parseProgress = (progress) => {
    return parseFloat(progress * 100).toFixed(2)
  }

  const remove = useCallback(
    (file) => {
      uploader.remove(file)
    },
    [uploader]
  )

  const retry = useCallback(
    (file) => {
      uploader.retry(file)
    },
    [uploader]
  )

  const resume = useCallback(
    (file) => {
      uploader.resume(file)
    },
    [uploader]
  )

  const pause = useCallback(
    (file) => {
      uploader.pause(file)
    },
    [uploader]
  )

  return (
    <div className="tiny-info-wrap" ari-status={file.status} key={file.uid}>
      <FileIcon size={14} />
      <div className="tiny-file-name" title={file.name}>
        {file.status} {file.name}
      </div>
      <div style={{ display: 'flex' }}>
        <div className="tiny-percent">{parseProgress(file.progress)}%</div>
        <div className="tiny-actions">
          {Status.Pause === file.status && (
            <span className="tiny-action" onClick={() => resume(file)}>
              <PlayIcon size={14} />
            </span>
          )}
          {Status.Uploading === file.status && (
            <span className="tiny-action" onClick={() => pause(file)}>
              <PauseIcon size={14} />
            </span>
          )}
          {(Status.Fail === file.status || Status.UploadFail === file.status) && (
            <span className="tiny-action" onClick={() => retry(file)}>
              <RetryIcon size={14} />
            </span>
          )}
          <span className="tiny-action" onClick={() => remove(file)}>
            <RemoveIcon size={14} />
          </span>
        </div>
      </div>

      <div className="tiny-progress-wrap">
        <div
          style={{ width: progressWidth }}
          className={[
            'tiny-progress',
            file.status === Status.Reading ? 'tiny--reading' : null,
            file.status === Status.Uploading ||
            file.status === Status.Pause ||
            file.status === Status.Resume ||
            file.status === Status.UploadSuccess
              ? 'tiny--uploading'
              : null,
            file.status === Status.Success ? 'tiny--success' : null,
            file.status === Status.Fail || file.status === Status.UploadFail ? 'tiny--fail' : null
          ].join(' ')}
        ></div>
      </div>
    </div>
  )
}

FileItem.propTypes = {
  file: PropTypes.object
}
