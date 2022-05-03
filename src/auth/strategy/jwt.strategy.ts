import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable } from '@nestjs/common'

import { UserService } from '../../user/user.service'
import { User } from '../../user/entities/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'some bad secret'
    })
  }

  async validate(payload: any): Promise<User> {
    return this.userService.findOne(payload.sub)
  }
}
