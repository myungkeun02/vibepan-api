import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false, logger: ['error', 'warn', 'log'] });
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.enableShutdownHooks();
  const server = await app.listen(Number(process.env.PORT || 4311), process.env.HOST || '127.0.0.1');
  server.requestTimeout = 60000;
  server.headersTimeout = 30000;
}
bootstrap().catch((error) => {
  console.error('startup_failed', error instanceof Error ? error.name : 'Error');
  process.exit(1);
});
