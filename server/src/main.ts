import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    // 前端withCredentials为true时需要这样设置
    origin(origin, callback) {
      callback(null, true);
    },
    credentials: true,
  });
  app.useStaticAssets('./uploads', {
    prefix: '/static',
  });
  await app.listen(3000);
}
bootstrap();
