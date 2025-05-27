export const isDefined = function (a) {
  return typeof a !== 'undefined'
}

export const isFunction = function (a) {
  return typeof a == 'function'
}

export const isPlainObject = function (obj) {
  return (
    Object.prototype.toString.call(obj) === '[object Object]' &&
    Object.getPrototypeOf(obj) === Object.prototype
  )
}

export const isArray =
  Array.isArray ||
  function (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }

export const isPromise = (promise) => {
  return promise && isFunction(promise.then)
}

export const isString = function (a) {
  return typeof a === 'string'
}

export const isBoolean = function (a) {
  return typeof a === 'boolean'
}


