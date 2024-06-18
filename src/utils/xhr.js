export default function http(opts) {
  const xhr = new XMLHttpRequest()
  let formData = new FormData()
  formData.append('file', opts.chunk)
  formData.append('chunkuid', opts.uid)
  formData.append('fileuid', opts.fileUid)
  // xhr.setRequestHeader(item, headers[item]);
  if(xhr.upload) {
    xhr.upload.onprogress = function(e) {
      // console.log(e.loaded / e.total)
      opts.onprogress(opts, e.loaded / e.total, e.loaded, e.total)
    }
  }
  xhr.onload = function() {
    if(xhr.status<200 || xhr.status>=300) {
      return
    }
    opts.onsuccess(opts)
  }
  xhr.onerror = function() {
    opts.onfail(opts)
  }
  xhr.open('POST', 'https://jsonplaceholder.typicode.com/posts/', true)
  xhr.send(formData)

  return xhr
}