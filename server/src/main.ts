import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const user = process.env.RABBITMQ_USER;
  const password = process.env.RABBITMQ_PASSWORD;
  const host = process.env.RABBITMQ_HOST;
  const queueName = process.env.RABBITMQ_QUEUE_NAME;
  try {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${password}@${host}`],
        queue: queueName,
        queueOptions: {
          durable: true,
        },
      },
    });
  } catch (error) {
    console.log('error', error);
  }

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
