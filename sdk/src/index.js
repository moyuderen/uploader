import { isFunction } from '@uploader/utils'

export default class Uploader {
  constructor() {

  }

  say() {
    console.log(isFunction(1))
  }
}