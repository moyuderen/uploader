export default class Event {
  constructor() {
    this.event = {}
  }

  on(name, func) {
    if (!this.event) {
      this.event = {}
    }

    if (!this.event[name]) {
      this.event[name] = []
    }

    // 避免通过函数多次被调用
    if (this.event[name].indexOf(func) > -1) {
      return
    }

    this.event[name].push(func)
  }

  off(name, func) {
    if (!func) {
      this.event[name] = []
      return
    }
    if (this.event && this.event[name]) {
      for (let i = 0; i < this.event[name].length; i++) {
        if (func === this.event[name]) {
          this.event.splice(i, 1)
          return
        }
      }
    }
  }

  emit(name, ...args) {
    if (!this.event) {
      this.event = {}
    }
    if (!this.event[name]) {
      return
    }
    this.event[name].forEach((func) => {
      func(...args)
    })
  }

  once(name, func) {
    function on(...args) {
      func.apply(this, ...args)
      this.off(name, on)
    }
    on.func = func
    this.on(name, on)
  }
}
