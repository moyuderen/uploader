import * as SparkMD5 from 'spark-md5'
import { isSupportWorker, computedHashWorker } from './hash-worker'

export const getHash = (data) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      const fileHash = SparkMD5.ArrayBuffer.hash(e.target.result)
      resolve(fileHash)
    }
    fileReader.onerror = () => {
      reject('文件读取失败')
    }
    fileReader.readAsArrayBuffer(data)
  })
}

export const computedHash = ({ file, chunkSize, totalChunks }, callback) => {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    let currentChunk = 0
    const startTime = Date.now()

    fileReader.onload = function (e) {
      spark.append(e.target.result)
      currentChunk++

      if (currentChunk < totalChunks) {
        loadNext()
        callback &&
          callback({
            progress: (currentChunk / totalChunks) * 100
          })
      } else {
        console.info('computed hash')
        const result = {
          hash: spark.end(),
          time: Date.now() - startTime,
          progress: 100
        }
        callback && callback(result)
        resolve(result)
      }
    }

    fileReader.onerror = function () {
      console.warn('oops, something went wrong.')
      reject()
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize

      fileReader.readAsArrayBuffer(slice.call(file, start, end))
    }

    loadNext()
  })
}

const computedHashNormal = ({ file, chunkSize }, callback) => {
  const slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader()
  const totalChunks = Math.ceil(file.size / chunkSize)
  const startTime = Date.now()
  let currentChunk = 0

  fileReader.onload = function (e) {
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
    }
  }

  fileReader.onerror = function (error) {
    console.warn('oops, something went wrong.')
    callback(error)
  }

  function loadNext() {
    const start = currentChunk * chunkSize
    const end = start + chunkSize >= file.size ? file.size : start + chunkSize

    fileReader.readAsArrayBuffer(slice.call(file, start, end))
  }

  loadNext()
}

export const asyncComputedHash = ({ file, chunkSize, inWorker }, callback) => {
  return new Promise((resolve, reject) => {
    const computedHash = isSupportWorker && inWorker ? computedHashWorker : computedHashNormal
    computedHash(
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
  })
}
