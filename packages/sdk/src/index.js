import Uploader from './core/Uploader.js'
import File from './core/File.js'
import Chunk from './core/Chunk.js'
import * as Utils from './shared/index.js'
import { Callbacks, FileStatus, ChunkStatus, CheckStatus } from './core/constants.js'

const create = (options) => new Uploader(options)

export default Uploader

export { create, File, Chunk, Utils, FileStatus, ChunkStatus, Callbacks, CheckStatus }
