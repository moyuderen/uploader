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
const multer_1 = require("multer");
const path_1 = require("path");
const file_service_1 = require("./file.service");
const upload_file_dto_1 = require("./dto/upload-file.dto");
const format_response_interceptor_1 = require("../format-response.interceptor");
let FileController = class FileController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    async check(hash, filename, status) {
        const uploadStatusInfo = await this.fileService.getCheckInfo(status);
        return Object.assign({ filename,
            hash }, uploadStatusInfo);
    }
    async upload(file, uploadFileDto) {
        return await this.fileService.saveChunk(file, uploadFileDto);
    }
    async merge(filename, hash) {
        return await this.fileService.getMergedFileUrl(filename, hash);
    }
};
exports.FileController = FileController;
__decorate([
    (0, common_1.Get)('check'),
    (0, common_1.UseInterceptors)(format_response_interceptor_1.FormatResponseInterceptor),
    __param(0, (0, common_1.Query)('hash')),
    __param(1, (0, common_1.Query)('filename')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "check", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: process.env.TMP_DIR || (0, path_1.join)(__dirname, '..', '..', 'public') + '/',
        }),
    }), format_response_interceptor_1.FormatResponseInterceptor),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_file_dto_1.UploadFileDto]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "upload", null);
__decorate([
    (0, common_1.UseInterceptors)(format_response_interceptor_1.FormatResponseInterceptor),
    (0, common_1.Get)('merge'),
    __param(0, (0, common_1.Query)('filename')),
    __param(1, (0, common_1.Query)('hash')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "merge", null);
exports.FileController = FileController = __decorate([
    (0, common_1.Controller)('file'),
    __metadata("design:paramtypes", [file_service_1.FileService])
], FileController);
//# sourceMappingURL=file.controller.js.map