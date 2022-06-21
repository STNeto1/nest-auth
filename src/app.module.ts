import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { GraphQLModule } from '@nestjs/graphql'
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius'

import { configValidationSchema } from './configuration/config'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { MailModule } from './mail/mail.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema
    }),
    LoggerModule.forRoot(),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoLoadEntities: true,
        host: configService.get('DB_HOST'),
        dbName: configService.get('DB_NAME'),
        type: 'postgresql',
        user: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        port: configService.get('DB_PORT'),
        debug: true,
        allowGlobalContext: true
      })
    }),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      graphiql: true,
      autoSchemaFile: true
    }),
    UserModule,
    AuthModule,
    MailModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
