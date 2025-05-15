import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin(origin, callback) {
      const allowedOrigins = ['http://localhost:5173'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // vercel 只有/tmp目录下有read权限
  const storagePath = process.env.TMP_DIR || join(__dirname, '..', 'public');
  app.useStaticAssets(storagePath, {
    prefix: '/static',
    setHeaders: (res, path) => {
      console.log(`[${new Date().toISOString()}] 提供静态文件: ${path}`);
    },
  });
  await app.listen(3000);
}
bootstrap();
