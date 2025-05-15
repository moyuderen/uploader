import { FileService } from './file.service';
import { UploadFileDto } from './dto/upload-file.dto';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    check(hash: string, filename: string, status: string, error: string): Promise<{
        hash: string;
        filename: string;
        status: string;
        data: string;
    } | {
        hash: string;
        filename: string;
        status: string;
        data: number[];
    } | {
        hash: string;
        filename: string;
        status: string;
        data: boolean;
    }>;
    upload(file: Express.Multer.File, uploadFileDto: UploadFileDto): Promise<{
        code: string;
        filename: string;
        hash: string;
        index: number;
    }>;
    merge(hash: string, filename: string, error: string): {
        code: string;
        data: string;
    };
}
