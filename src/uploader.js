import extend from './utils/extend.js'
import each from './utils/each.js'
import { defaultOpts, defaultAttributes } from './configs.js'
import File from './file.js'
import { pool } from './pool.js'
import { Status } from './utils/Status.js'

export default class Uploader {
  constructor(options) {
    this.opts = extend({}, defaultOpts, options)
    this.fileList = []
  }

  assignBrowse(domNode, attributes) {
    let input
    attributes = extend({}, defaultAttributes, attributes) 
    if (domNode.tagname === 'INPUT' && domNode.type === 'file') {
      input = domNode
    } else {
      input = document.createElement('input')
      input.setAttribute('type', 'file')
      if (!attributes.singleFile) {
        input.setAttribute('multiple', 'multiple')
      }
      extend(input.style, {
        visibility: 'hidden',
        position: 'absolute',
        width: '1px',
        height: '1px'
      })

      each(attributes, (val, key) => {
        input.setAttribute(key, val)
      })

      input.addEventListener('change', (e) => {
        this.addFiles(e.target.files, e)
        e.target.value = ''
      }, false)

      domNode.appendChild(input)
      domNode.addEventListener('click', function (e) {
        input.click()
      }, false)
    }
  }

  assignDrop(domNode) {
    const preventEvent = (e) => {
      e.preventDefault()
    }
    const handles = {
      dragover: preventEvent,
      dragenter: preventEvent,
      dragleave: preventEvent,
      drop: (e) => {
        e.stopPropagation()
        e.preventDefault()
        this.addFiles(e.dataTransfer.files, e)
      }
    }
    each(handles, (handler, name) => {
      domNode.addEventListener(name, handler, false)
    })
  }

  addFiles(files, e) {
    this.fileList = [...files].map(file => {
      return new File(this, file)
    })
    this.upload()
  }

  async upload() {
    for(let i=0; i<this.fileList.length; i++) {
      const file = this.fileList[i]
      const chunkPromises = []
      for(let j=0; j<file.chunks.length; j++) {
        const chunk = file.chunks[j]
        chunkPromises.push(chunk)
      }
      try {
        await pool(chunkPromises, 10)
        file.status = Status.Success
        file.progress = 1
      } catch(e) {
        console.log(e)
        file.status = Status.Fail
      }
    }
  }
}

