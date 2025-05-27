# 实例

## Uploader {#uploader}

```typescript
interface Uploader {
  fileList: File[]
  options: object
  assignBrowse: (dom: HTMLElement, userAttributes: UserAttributes) => void
  assignDrop: (dom: HTMLElement) => void
  setDefaultFileList: (fileList: File[]) => void
  submit: () => void
  pause: (file: File) => void
  resume: (file: File) => void
  retry: (file: File) => void
  remove: (file?: File) => void
  clear: () => void
  destroy: () => void
}
```

## File {#file}

```typescript
interface File {
  uploader: Uploader
  options: object

  status: FileStatus
  uid: string
  rawFile: File
  name: string
  size: number
  type: string
  hash: string
  url: string
  renderSize: string

  progress: number
  chunkSize: number
  chunks: Chunk[]
  totalChunks: number
  readProgress: number

  errorMessage: string
  data: Record<string, any>

  setErrorMessage: (message: string) => File
  setData: (data: Record<string, any>) => File
}
```

> [!NOTE]
> 枚举[`FileStatus`](enum.md#file-status)

## Chunk {#chunk}

```typescript
interface Chunk {
  uploader: Uploader
  file: File
  options: object

  fileId: string
  rawFile: File
  fileHash: string
  filename: string
  totalSize: number
  chunkSize: number
  totalChunks: number

  uid: string
  chunkIndex: number
  status: ChunkStatus
  startByte: number
  endByte: number
  size: number
  progress: number
  fakeProgress: number

  maxRetries: number
}
```

> [!NOTE]
> 枚举[`ChunkStatus`](enum.md#chunk-status)
