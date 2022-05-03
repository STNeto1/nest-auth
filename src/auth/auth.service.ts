import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { LoginInput } from '../user/dto/login.input'
import { User } from '../user/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async validateUser(data: LoginInput) {
    const user = await this.userService.findByEmailAndPassword(data)

    return this.generateToken(user)
  }

  generateToken(user: User) {
    const payload = {
      sub: user.id
    }

    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
