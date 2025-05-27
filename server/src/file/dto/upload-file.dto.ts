export class UploadFileDto {
  filename: string;
  index: number;
  hash: string;
  error?: string;
}

export enum CheckStatus {
  Success = 'success',
  WaitMerge = 'waitMerge',
  Part = 'part',
  None = 'none',
}
