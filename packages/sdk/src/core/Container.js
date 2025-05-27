import { each, extend } from '../shared/index.js'

class Container {
  constructor(uploader) {
    this.uploader = uploader
    this.listeners = [] // 存储事件监听器
    this.inputs = [] // 存储动态创建的 input 元素
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
      this.listeners.push({ node: domNode, event, handler })
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
    this.inputs.push(input)
    return input
  }

  setInputAttributes(input, attributes) {
    each(attributes, (value, key) => input.setAttribute(key, value))
    input.toggleAttribute('multiple', !!attributes.multiple)
  }

  attachBrowseEvents(domNode, input) {
    const clickHandler = () => input.click()
    const changeHandler = (e) => {
      this.uploader.addFiles(e.target.files, e)
      e.target.value = ''
    }

    domNode.addEventListener('click', clickHandler, { passive: true })
    input.addEventListener('change', changeHandler, { passive: true })

    this.listeners.push(
      { node: domNode, event: 'click', handler: clickHandler },
      { node: input, event: 'change', handler: changeHandler }
    )
  }

  handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    this.uploader.addFiles(e.dataTransfer.files, e)
  }

  destroy() {
    this.listeners.forEach(({ node, event, handler }) => {
      node.removeEventListener(event, handler)
    })
    this.listeners = []

    this.inputs.forEach((input) => {
      if (input.parentNode) {
        input.parentNode.removeChild(input)
      }
    })
    this.inputs = []

    return this
  }
}

export default Container
