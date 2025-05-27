"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path_1 = require("path");
const upload_file_dto_1 = require("./dto/upload-file.dto");
const utils_1 = require("../utils");
let FileService = class FileService {
    constructor() {
        this.storagePath = process.env.TMP_DIR || (0, path_1.join)(__dirname, '..', '..', 'public');
    }
    getChunkDir(hash, filename) {
        return `${this.storagePath}/${hash}_${filename}`;
    }
    async getCheckInfo(status) {
        await (0, utils_1.sleep)(1000);
        switch (status) {
            case upload_file_dto_1.CheckStatus.Success:
                return {
                    status: upload_file_dto_1.CheckStatus.Success,
                    data: 'https://baidu.com',
                };
            case upload_file_dto_1.CheckStatus.WaitMerge:
                return {
                    status: upload_file_dto_1.CheckStatus.WaitMerge,
                    data: '',
                };
            case upload_file_dto_1.CheckStatus.Part:
                return {
                    status: upload_file_dto_1.CheckStatus.Part,
                    data: [0, 2, 4, 6, 8, 10],
                };
            case upload_file_dto_1.CheckStatus.None:
                return {
                    status: upload_file_dto_1.CheckStatus.None,
                    data: false,
                };
            default:
                return {
                    status: upload_file_dto_1.CheckStatus.None,
                    data: false,
                };
        }
    }
    async saveChunk(file, uploadFileDto) {
        const { filename, hash, index } = uploadFileDto;
        if (!utils_1.isVercel) {
            await (0, utils_1.sleep)(2000);
            const chunkDir = this.getChunkDir(hash, filename);
            if (!fs.existsSync(chunkDir)) {
                fs.mkdirSync(chunkDir);
            }
            fs.cpSync(file.path, chunkDir + '/' + index);
            fs.rmSync(file.path);
        }
        return {
            filename,
            hash,
            index,
        };
    }
    async getMergedFileUrl(filename, hash) {
        if (!utils_1.isVercel) {
            await (0, utils_1.sleep)(1000);
            const chunkDir = this.getChunkDir(hash, filename);
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
                stream.pipe(fs.createWriteStream(`${this.storagePath}/` + filename, {
                    start: startPos,
                }));
                startPos += fs.statSync(filePath).size;
            });
        }
        return `http://localhost:3000/static/${filename}`;
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)()
], FileService);
//# sourceMappingURL=file.service.js.map