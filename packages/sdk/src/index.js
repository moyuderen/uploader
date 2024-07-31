import Uploader from '@/core/Uploader.js'
import File from '@/core/File'
import Chunk from '@/core/Chunk'
import { Status, Events, CheckStatus } from '@/core/constans'

const create = (options) => {
  return new Uploader(options)
}
export default Uploader
export { File, Status, Events, CheckStatus, Chunk, create }
