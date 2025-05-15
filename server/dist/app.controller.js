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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const app_service_1 = require("./app.service");
const platform_express_1 = require("@nestjs/platform-express");
const utils_1 = require("./utils");
const multer_1 = require("multer");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async uploadFile(file, body) {
        const { filename, hash, index } = body;
        const chunkDir = `uploads/${hash}_${filename}`;
        if (!fs.existsSync(chunkDir)) {
            fs.mkdirSync(chunkDir);
        }
        fs.cpSync(file.path, chunkDir + '/' + index);
        fs.rmSync(file.path);
        await (0, utils_1.sleep)(1000);
        return { data: true };
    }
    async merge(hash, filename) {
        const chunkDir = `uploads/${hash}_${filename}`;
        const files = fs.readdirSync(chunkDir);
        files.sort((aVal, bVal) => {
            const a = parseInt(aVal);
            const b = parseInt(bVal);
            if (a > b) {
                return 1;
            }
            if (a < b) {
                return -1;
            }
            return 0;
        });
        let startPos = 0;
        files.map((file) => {
            const filePath = chunkDir + '/' + file;
            const stream = fs.createReadStream(filePath);
            stream.pipe(fs.createWriteStream('uploads/' + filename, {
                start: startPos,
            }));
            startPos += fs.statSync(filePath).size;
        });
        await (0, utils_1.sleep)(1000);
        return {
            data: `http://localhost:3000/static/${filename}`,
        };
    }
    async checkFile(hash, filename, status) {
        await (0, utils_1.sleep)(500);
        if (status === 'success') {
            return {
                status: 'success',
                data: 'https://baidu.com',
            };
        }
        if (status === 'waitMerge') {
            return {
                status: 'waitMerge',
                data: '',
            };
        }
        if (status === 'part') {
            return {
                status: 'part',
                data: [0, 2, 4, 6, 8, 10],
            };
        }
        if (status === 'none') {
            return {
                status: 'none',
                data: false,
            };
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: 'uploads/',
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('merge'),
    __param(0, (0, common_1.Query)('hash')),
    __param(1, (0, common_1.Query)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "merge", null);
__decorate([
    (0, common_1.Get)('check'),
    __param(0, (0, common_1.Query)('hash')),
    __param(1, (0, common_1.Query)('filename')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "checkFile", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map