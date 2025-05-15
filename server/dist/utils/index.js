"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interceptRequest = exports.sleep = void 0;
const common_1 = require("@nestjs/common");
const sleep = (time = 2000, isReject = false) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            clearInterval(timer);
            if (isReject) {
                reject(false);
            }
            resolve(true);
        }, time);
    });
};
exports.sleep = sleep;
const interceptRequest = () => {
    if (process.env.CONTAINER === 'vercel') {
        throw new common_1.HttpException('Please use https://uploader-server-seven.vercel.app/file !', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.interceptRequest = interceptRequest;
//# sourceMappingURL=index.js.map