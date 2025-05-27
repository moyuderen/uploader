"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.isVercel = void 0;
exports.isVercel = process.env.CONTAINER === 'vercel';
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
//# sourceMappingURL=index.js.map