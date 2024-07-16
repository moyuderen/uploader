export * from './types'
export * from './event'

import { isDefined, isFunction, isArray, isPlainObject } from './types'

export function each(ary, func, context) {
  if (isDefined(ary.length)) {
    for (var i = 0, len = ary.length; i < len; i++) {
      if (func.call(context, ary[i], i, ary) === false) {
        break
      }
    }
  } else {
    for (var k in ary) {
      if (func.call(context, ary[k], k, ary) === false) {
        break
      }
    }
  }
}

let uid = 0
export const generateUid = (prex = 'id') => `${prex}-${+new Date()}-${uid++}`

export function extend() {
  var options
  var name
  var src
  var copy
  var copyIsArray
  var clone
  var target = arguments[0] || {}
  var i = 1
  var length = arguments.length
  var force = false

  // 如果第一个参数为布尔,判定是否深拷贝
  if (typeof target === 'boolean') {
    force = target
    target = arguments[1] || {}
    i++
  }

  // 确保接受方为一个复杂的数据类型
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {}
  }

  // 如果只有一个参数，那么新成员添加于 extend 所在的对象上
  if (i === length) {
    target = this
    i--
  }

  for (; i < length; i++) {
    // 只处理非空参数
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name]
        copy = options[name]

        // 防止环引用
        if (target === copy) {
          continue
        }
        if (force && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && isArray(src) ? src : []
          } else {
            clone = src && isPlainObject(src) ? src : {}
          }
          target[name] = extend(force, clone, copy)
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }
  return target
}

export const sleep = (time = 600, mockError = false) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      mockError ? reject() : resolve()
    }, time)
  })
}
