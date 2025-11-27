import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LeadOneLogger } from './logging/leadone.logger';
// ex
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.useStaticAssets(join(__dirname, '..', 'static'));
  await app.listen(process.env.PORT ?? 4000);
  const logger = new LeadOneLogger();
  app.useLogger(logger);
}
bootstrap();
