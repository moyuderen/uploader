const defaultOpts = {
  target:  'https://jsonplaceholder.typicode.com/posts',
  chunkSize: 1 * 1024 * 2,
  headers: {
    'name': 'hah'
  },
  data: {
    
  }
}

const defaultAttributes = {
  singleFile: false
}

export {
  defaultOpts,
  defaultAttributes
}