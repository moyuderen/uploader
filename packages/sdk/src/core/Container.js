import { each, extend } from '../shared/index.js'

class Container {
  constructor(uploader) {
    this.uploader = uploader
  }

  assignBrowse(domNode, attributes) {
    if (!domNode) {
      console.warn('DOM 节点不存在')
      return
    }

    const input = this.createOrGetInput(domNode)
    this.setInputAttributes(input, attributes)
    this.attachBrowseEvents(domNode, input)
  }

  assignDrop(domNode) {
    if (!domNode) {
      console.warn('DOM 节点不存在')
      return
    }

    const preventEvent = (e) => e.preventDefault()
    const eventHandlers = {
      dragover: preventEvent,
      dragenter: preventEvent,
      dragleave: preventEvent,
      drop: this.handleDrop.bind(this)
    }

    each(eventHandlers, (handler, event) => {
      domNode.addEventListener(event, handler, { passive: false })
    })
  }

  createOrGetInput(domNode) {
    if (domNode.tagName === 'INPUT' && domNode.type === 'file') {
      return domNode
    }

    const input = document.createElement('input')
    input.type = 'file'
    extend(input.style, {
      visibility: 'hidden',
      position: 'absolute',
      width: '1px',
      height: '1px'
    })
    domNode.appendChild(input)
    return input
  }

  setInputAttributes(input, attributes) {
    each(attributes, (value, key) => input.setAttribute(key, value))
    input.toggleAttribute('multiple', !!attributes.multiple)
  }

  attachBrowseEvents(domNode, input) {
    domNode.addEventListener('click', () => input.click(), { passive: true })
    input.addEventListener(
      'change',
      (e) => {
        this.uploader.addFiles(e.target.files, e)
        e.target.value = ''
      },
      { passive: true }
    )
  }

  handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    this.uploader.addFiles(e.dataTransfer.files, e)
  }
}

export default Container
