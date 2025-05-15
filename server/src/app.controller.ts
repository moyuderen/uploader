import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as fs from 'fs';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { sleep, interceptRequest } from './utils';
import { diskStorage } from 'multer';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // vercel 只有/tmp目录下有read权限
  private readonly storagePath =
    process.env.TMP_DIR || join(__dirname, '..', 'public');
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  // file和前端上传的名称保持一致
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination:
          // vercel 只有/tmp目录下有read权限
          process.env.TMP_DIR || join(__dirname, '..', 'public') + '/',
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    interceptRequest();
    const { filename, hash, index } = body;
    const chunkDir = `${this.storagePath}/${hash}_${filename}`;

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    fs.cpSync(file.path, chunkDir + '/' + index);
    fs.rmSync(file.path);
    await sleep(1000);
    return { data: true };
  }

  @Get('merge')
  async merge(
    @Query('hash') hash: string,
    @Query('filename') filename: string,
  ) {
    interceptRequest();
    const chunkDir = `${this.storagePath}/${hash}_${filename}`;
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

    await sleep(1000);
    return {
      data: `http://localhost:3000/static/${filename}`,
    };
  }

  @Get('check')
  async checkFile(
    @Query('hash') hash: string,
    @Query('filename') filename: string,
    @Query('status') status: string,
  ) {
    interceptRequest();
    await sleep(500);
    if (status === 'success') {
      return {
        status: 'success',
        data: 'https://baidu.com',
      };
    }

    if (status === 'waitMerge') {
      return {
        status: 'waitMerge',
        data: '',
      };
    }

    if (status === 'part') {
      return {
        status: 'part',
        data: [0, 2, 4, 6, 8, 10],
      };
    }

    if (status === 'none') {
      return {
        status: 'none',
        data: false,
      };
    }
  }
}
