import * as SparkMD5 from 'spark-md5'
import { isSupportWorker, computedHashWorker } from './hash-worker'

const computedHashNormal = ({ file, chunkSize }, callback) => {
  const slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader()
  const totalChunks = Math.ceil(file.size / chunkSize)
  const startTime = Date.now()
  let currentChunk = 0

  // 创建 AbortController 用于中断
  const controller = new AbortController()
  const signal = controller.signal

  signal.addEventListener('abort', () => {
    fileReader.abort() // 中断 FileReader
    callback(new Error('Hash calculation cancelled'), { progress: 0 })
  })

  fileReader.onload = function (e) {
    if (signal.aborted) return

    spark.append(e.target.result)
    currentChunk++
    if (currentChunk < totalChunks) {
      loadNext()
      callback(null, {
        progress: (currentChunk / totalChunks) * 100
      })
    } else {
      const result = {
        hash: spark.end(),
        time: Date.now() - startTime,
        progress: 100
      }
      callback(null, result)
      return
    }
  }

  fileReader.onerror = function (error) {
    if (signal.aborted) return
    console.warn('Hash calculation error')
    callback(error, { progress: 0 })
  }

  function loadNext() {
    if (signal.aborted) return
    const start = currentChunk * chunkSize
    const end = start + chunkSize >= file.size ? file.size : start + chunkSize

    fileReader.readAsArrayBuffer(slice.call(file, start, end))
  }

  loadNext()

  return {
    abort: () => controller.abort()
  }
}

export const asyncCancellableComputedHash = (
  { file, chunkSize, useWebWoker = false },
  callback
) => {
  let abortComputedHash

  const promise = new Promise((resolve, reject) => {
    const computedHash = isSupportWorker && useWebWoker ? computedHashWorker : computedHashNormal

    const { abort } = computedHash(
      {
        file,
        chunkSize
      },
      (error, { progress, hash, time }) => {
        if (error) {
          reject(error)
        }
        if (progress === 100) {
          resolve({ progress, hash, time })
        }
        callback && callback({ progress })
      }
    )
    abortComputedHash = { abort, reject }
  })

  return {
    promise,
    abort: () => {
      if (!abortComputedHash) return
      abortComputedHash.abort()
      abortComputedHash.reject()
    }
  }
}
