import { isFunction, isPromise } from './types'

function ready(fn, data, success, fail) {
  if (isFunction(fn)) {
    const result = fn(data)
    if (isPromise(result)) {
      result.then(success, fail)
    } else {
      result ? success() : fail()
    }
  } else {
    success()
  }
}

export default ready
