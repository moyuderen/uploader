import { each, extend } from '@/shared'

class Container {
  constructor(uploader) {
    this.uploader = uploader
  }

  assignBrowse(domNode, attributes) {
    let input
    if (!domNode) {
      console.warn('domNode is not exist')
      return
    }
    if (domNode.tagName === 'INPUT' && domNode.type === 'file') {
      input = domNode
    } else {
      input = document.createElement('input')
      input.setAttribute('type', 'file')

      extend(input.style, {
        visibility: 'hidden',
        position: 'absolute',
        width: '1px',
        height: '1px'
      })

      each(attributes, (val, key) => {
        input.setAttribute(key, val)
      })

      if (attributes.multiple) {
        input.setAttribute('multiple', 'multiple')
      } else {
        input.removeAttribute('multiple')
      }

      domNode.appendChild(input)
      domNode.addEventListener(
        'click',
        () => {
          input.click()
        },
        false
      )

      input.addEventListener(
        'change',
        (e) => {
          this.uploader.addFiles(e.target.files, e)
          e.target.value = ''
        },
        false
      )
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
        this.uploader.addFiles(e.dataTransfer.files, e)
      }
    }
    each(handles, (handler, name) => {
      domNode.addEventListener(name, handler, false)
    })
  }
}

export default Container
