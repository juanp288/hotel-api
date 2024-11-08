import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Hotel API')
    .setDescription('Ejercicio - The Flock')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('open-api', app, document, {
    swaggerOptions: {
      filter: true,
    },
  });

  await app.listen(3000);
  logger.log(`Server is running!, View docs: ${await app.getUrl()}/docs/`);
}
bootstrap();
