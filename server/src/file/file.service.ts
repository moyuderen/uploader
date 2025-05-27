import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { UploadFileDto, CheckStatus } from './dto/upload-file.dto';
import { isVercel, sleep } from '../utils';
@Injectable()
export class FileService {
  // vercel 只有/tmp目录下有read权限
  private readonly storagePath =
    process.env.TMP_DIR || join(__dirname, '..', '..', 'public');

  getChunkDir(hash: string, filename: string) {
    return `${this.storagePath}/${hash}_${filename}`;
  }

  async getCheckInfo(status: string) {
    await sleep(1000);
    switch (status) {
      case CheckStatus.Success:
        return {
          status: CheckStatus.Success,
          data: 'https://baidu.com',
        };
      case CheckStatus.WaitMerge:
        return {
          status: CheckStatus.WaitMerge,
          data: '',
        };
      case CheckStatus.Part:
        return {
          status: CheckStatus.Part,
          data: [0, 2, 4, 6, 8, 10],
        };
      case CheckStatus.None:
        return {
          status: CheckStatus.None,
          data: false,
        };
      default:
        return {
          status: CheckStatus.None,
          data: false,
        };
    }
  }

  async saveChunk(file: Express.Multer.File, uploadFileDto: UploadFileDto) {
    const { filename, hash, index } = uploadFileDto;
    if (!isVercel) {
      await sleep(2000);
      const chunkDir = this.getChunkDir(hash, filename);

      if (!fs.existsSync(chunkDir)) {
        fs.mkdirSync(chunkDir);
      }
      fs.cpSync(file.path, chunkDir + '/' + index);
      fs.rmSync(file.path);
    }
    return {
      filename,
      hash,
      index,
    };
  }

  async getMergedFileUrl(filename: string, hash: string) {
    if (!isVercel) {
      await sleep(1000);
      const chunkDir = this.getChunkDir(hash, filename);
      const files = fs.readdirSync(chunkDir);

      // 按顺序合并
      files.sort((aVal, bVal) => {
        const a = parseInt(aVal);
        const b = parseInt(bVal);
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
      });

      let startPos = 0;
      files.map((file) => {
        const filePath = chunkDir + '/' + file;
        const stream = fs.createReadStream(filePath);
        stream.pipe(
          fs.createWriteStream(`${this.storagePath}/` + filename, {
            start: startPos,
          }),
        );

        startPos += fs.statSync(filePath).size;
      });
    }

    return `http://localhost:3000/static/${filename}`;
  }
}
