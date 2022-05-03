import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { LoginInput } from '../user/dto/login.input'
import { User } from '../user/entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from './guard/gql.guard'
import { CurrentUser } from './decorators/current-user'
import { JwtReturn } from './types/jwt.return'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => JwtReturn)
  async login(@Args('data') data: LoginInput): Promise<JwtReturn> {
    return await this.authService.validateUser(data)
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async whoAmi(@CurrentUser() user: User) {
    return user
  }
}
