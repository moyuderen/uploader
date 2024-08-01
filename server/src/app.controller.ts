import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as fs from 'fs';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { sleep } from './utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  // file和前端上传的名称保持一致
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    const { filename, hash, index } = body;
    const chunkDir = `uploads/${hash}_${filename}`;

    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    fs.cpSync(file.path, chunkDir + '/' + index);
    fs.rmSync(file.path);
    await sleep(1000);
    return { data: true };
  }

  @Post('merge')
  async merge(@Body() body) {
    const { hash, name: filename } = body;
    const chunkDir = `uploads/${hash}_${filename}`;
    const files = fs.readdirSync(chunkDir);

    let startPos = 0;
    files.map((file) => {
      const filePath = chunkDir + '/' + file;
      const stream = fs.createReadStream(filePath);
      stream.pipe(
        fs.createWriteStream('uploads/' + filename, {
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

  @Post('checkFile')
  async checkFile(@Body() body) {
    const { status } = body;
    await sleep(500);
    if (status === 'success') {
      return {
        status: 'success',
        data: 'https://baidu.com',
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
