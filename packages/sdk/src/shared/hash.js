import * as SparkMD5 from 'spark-md5'

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
