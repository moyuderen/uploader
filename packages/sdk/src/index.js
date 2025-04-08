import Uploader from '@/core/Uploader.js'
import File from '@/core/File'
import Chunk from '@/core/Chunk'
import { Callbacks, FileStatus, ChunkStatus, CheckStatus } from '@/core/constants'

const create = (options) => {
  return new Uploader(options)
}

export default Uploader

export { File, Chunk, create, FileStatus, ChunkStatus, Callbacks, CheckStatus }
