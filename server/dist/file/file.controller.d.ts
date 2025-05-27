import { FileService } from './file.service';
import { UploadFileDto } from './dto/upload-file.dto';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    check(hash: string, filename: string, status: string): Promise<{
        status: import("./dto/upload-file.dto").CheckStatus;
        data: string;
        filename: string;
        hash: string;
    } | {
        status: import("./dto/upload-file.dto").CheckStatus;
        data: number[];
        filename: string;
        hash: string;
    } | {
        status: import("./dto/upload-file.dto").CheckStatus;
        data: boolean;
        filename: string;
        hash: string;
    }>;
    upload(file: Express.Multer.File, uploadFileDto: UploadFileDto): Promise<{
        filename: string;
        hash: string;
        index: number;
    }>;
    merge(filename: string, hash: string): Promise<string>;
}
