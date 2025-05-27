export declare class UploadFileDto {
    filename: string;
    index: number;
    hash: string;
    error?: string;
}
export declare enum CheckStatus {
    Success = "success",
    WaitMerge = "waitMerge",
    Part = "part",
    None = "none"
}
