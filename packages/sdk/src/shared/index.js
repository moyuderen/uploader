export const sleep = (time = 600, mockError = false) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      mockError ? reject() : resolve()
    }, time)
  })
}

export * from './uid'
export * from './types'
export * from './array'
export * from './object'
export * from './event'
export * from './hash'
