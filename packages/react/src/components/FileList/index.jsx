import PropTypes from 'prop-types'
import React from 'react'

export default function FileList(props) {
  const { fileList = [], children } = props

  return (
    <div>
      {fileList.map((file) => {
        return React.Children.map(children, (child) => {
          return React.cloneElement(child, { file })
        })
      })}
    </div>
  )
}

FileList.propTypes = {
  fileList: PropTypes.array,
  children: PropTypes.any
}
