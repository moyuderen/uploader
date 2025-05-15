"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
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