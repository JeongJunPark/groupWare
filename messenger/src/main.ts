import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { LeadMsgLogger } from './logging/leadmsg.logger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:4010', credentials: true });
  await app.listen(5000);
  const logger = new LeadMsgLogger();
  app.useLogger(logger);  
  console.log('HTTP server running on 5000');
}
bootstrap();