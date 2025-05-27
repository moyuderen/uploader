import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { FileService } from './file.service';
import { UploadFileDto } from './dto/upload-file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('check')
  async check(
    @Query('hash') hash: string,
    @Query('filename') filename: string,
    @Query('status') status: string,
  ) {
    const uploadStatusInfo = await this.fileService.getCheckInfo(status);
    return {
      filename,
      hash,
      ...uploadStatusInfo,
    };
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination:
          // vercel 只有/tmp目录下有read权限
          process.env.TMP_DIR || join(__dirname, '..', '..', 'public') + '/',
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
  ) {
    return await this.fileService.saveChunk(file, uploadFileDto);
  }

  @Get('merge')
  async merge(
    @Query('filename') filename: string,
    @Query('hash') hash: string,
  ) {
    return await this.fileService.getMergedFileUrl(filename, hash);
  }
}
