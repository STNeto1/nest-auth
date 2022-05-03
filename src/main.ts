import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'

import { AppModule } from './app.module'
import { Logger } from 'nestjs-pino'

export async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true
    }
  )

  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(app.get(Logger))

  await app.listen(3000, '0.0.0.0')

  return app
}

if (!process.env.HMR) bootstrap()
