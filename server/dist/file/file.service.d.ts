import { UploadFileDto, CheckStatus } from './dto/upload-file.dto';
export declare class FileService {
    private readonly storagePath;
    getChunkDir(hash: string, filename: string): string;
    getCheckInfo(status: string): Promise<{
        status: CheckStatus;
        data: string;
    } | {
        status: CheckStatus;
        data: number[];
    } | {
        status: CheckStatus;
        data: boolean;
    }>;
    saveChunk(file: Express.Multer.File, uploadFileDto: UploadFileDto): Promise<{
        filename: string;
        hash: string;
        index: number;
    }>;
    getMergedFileUrl(filename: string, hash: string): Promise<string>;
}
