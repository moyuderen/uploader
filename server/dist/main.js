"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin(origin, callback) {
            callback(null, true);
        },
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'), {
        prefix: '/static',
        setHeaders: (res, path) => {
            console.log(`[${new Date().toISOString()}] 提供静态文件: ${path}`);
        },
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map