"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const file_service_1 = require("./file.service");
const upload_file_dto_1 = require("./dto/upload-file.dto");
const utils_1 = require("../utils");
let FileController = class FileController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    async check(hash, filename, status, error) {
        if (error) {
            throw new common_1.HttpException('Mock check fail !', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        await (0, utils_1.sleep)(500);
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
    async upload(file, uploadFileDto) {
        const { filename, hash, index, error } = uploadFileDto;
        if (error) {
            throw new common_1.HttpException('Mock upload fail !', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        await (0, utils_1.sleep)(800);
        return {
            code: '00000',
            filename,
            hash,
            index,
        };
    }
    merge(hash, filename, error) {
        if (error) {
            throw new common_1.HttpException('Mock merge fail !', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            code: '00000',
            data: `http://localhost:3000/static/${filename}`,
        };
    }
};
exports.FileController = FileController;
__decorate([
    (0, common_1.Get)('check'),
    __param(0, (0, common_1.Query)('hash')),
    __param(1, (0, common_1.Query)('filename')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('error')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "check", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_file_dto_1.UploadFileDto]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)('merge'),
    __param(0, (0, common_1.Query)('hash')),
    __param(1, (0, common_1.Query)('filename')),
    __param(2, (0, common_1.Query)('error')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "merge", null);
exports.FileController = FileController = __decorate([
    (0, common_1.Controller)('file'),
    __metadata("design:paramtypes", [file_service_1.FileService])
], FileController);
//# sourceMappingURL=file.controller.js.map