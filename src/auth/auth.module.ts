import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { JwtStrategy } from './strategy/jwt.strategy'
import { AuthResolver } from './auth.resolver'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'some bad secret',
      signOptions: {
        expiresIn: '1h'
      }
    })
  ],
  providers: [AuthService, JwtStrategy, AuthResolver]
})
export class AuthModule {}
