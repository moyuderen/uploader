import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { sleep } from '../utils';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('check')
  async check(
    @Query('hash') hash: string,
    @Query('filename') filename: string,
    @Query('status') status: string,
    @Query('error') error: string,
  ) {
    if (error) {
      throw new HttpException(
        'Mock check fail !',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    await sleep(500);
    if (status === 'success') {
      return {
        hash,
        filename,
        status: 'success',
        data: 'https://baidu.com',
      };
    }

    if (status === 'waitMerge') {
      return {
        hash,
        filename,
        status: 'waitMerge',
        data: '',
      };
    }

    if (status === 'part') {
      return {
        hash,
        filename,
        status: 'part',
        data: [0, 2, 4, 6, 8, 10],
      };
    }

    if (status === 'none') {
      return {
        hash,
        filename,
        status: 'none',
        data: false,
      };
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
  ) {
    const { filename, hash, index, error } = uploadFileDto;

    if (error) {
      throw new HttpException(
        'Mock upload fail !',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    await sleep(800);
    return {
      code: '00000',
      filename,
      hash,
      index,
    };
  }

  @Get('merge')
  merge(
    @Query('hash') hash: string,
    @Query('filename') filename: string,
    @Query('error') error: string,
  ) {
    if (error) {
      throw new HttpException(
        'Mock merge fail !',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      code: '00000',
      data: `http://localhost:3000/static/${filename}`,
    };
  }
}
