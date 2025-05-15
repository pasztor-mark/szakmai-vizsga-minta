import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors() // KÖTELEZŐ frontend és backend közötti kommunikációhoz
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
