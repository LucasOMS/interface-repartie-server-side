import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useLogger(app.get(Logger));
    app.enableCors();
    await app.listen(4444);
}

bootstrap();
