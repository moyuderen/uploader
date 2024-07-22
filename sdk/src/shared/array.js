import { isDefined } from './types'

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
