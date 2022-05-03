import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { GraphQLModule } from '@nestjs/graphql'
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { configValidationSchema } from './configuration/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema
    }),
    LoggerModule.forRoot(),
    MikroOrmModule.forRoot(),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      graphiql: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
