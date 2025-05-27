import { isFunction, isString } from '../shared'
export default class Event {
  constructor() {
    this.events = new Map()
  }

  on(name, callback) {
    if (!isFunction(callback)) return

    const callbacks = this.events.get(name) || []
    if (!callbacks.includes(callback)) {
      callbacks.push(callback)
      this.events.set(name, callbacks)
    }
  }

  off(name, callback) {
    if (!this.events.has(name)) return

    if (!callback) {
      this.events.set(name, [])
      return
    }

    const callbacks = this.events.get(name).filter((cb) => cb !== callback)
    this.events.set(name, callbacks)
  }

  emit(name, ...args) {
    const callbacks = this.events.get(name)
    if (callbacks && callbacks.length) {
      callbacks.forEach((cb) => cb(...args))
    }
  }

  once(name, callback) {
    if (!isFunction(callback)) return

    const onceCallback = (...args) => {
      callback(...args)
      this.off(name, onceCallback)
    }
    this.on(name, onceCallback)
  }

  clear(name) {
    if (name === undefined) {
      this.events.clear()
    } else if (isString(name) && this.events.has(name)) {
      this.events.set(name, [])
    }
    return this
  }
}
