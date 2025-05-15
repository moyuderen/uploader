import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    private readonly storagePath;
    getHello(): string;
    uploadFile(file: Express.Multer.File, body: any): Promise<{
        data: boolean;
    }>;
    merge(hash: string, filename: string): Promise<{
        data: string;
    }>;
    checkFile(hash: string, filename: string, status: string): Promise<{
        status: string;
        data: string;
    } | {
        status: string;
        data: number[];
    } | {
        status: string;
        data: boolean;
    }>;
}
