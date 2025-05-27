"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const format_response_interceptor_1 = require("./format-response.interceptor");
const custom_exception_filter_1 = require("./custom-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin(origin, callback) {
            callback(null, true);
        },
        credentials: true,
    });
    const storagePath = process.env.TMP_DIR || (0, path_1.join)(__dirname, '..', 'public');
    app.useStaticAssets(storagePath, {
        prefix: '/static',
        setHeaders: (res, path) => {
            console.log(`[${new Date().toISOString()}] 提供静态文件: ${path}`);
        },
    });
    app.useGlobalInterceptors(new format_response_interceptor_1.FormatResponseInterceptor());
    app.useGlobalFilters(new custom_exception_filter_1.CustomExceptionFilter());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map