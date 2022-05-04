import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { UserService } from './user.service'
import { User } from './entities/user.entity'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../auth/guard/gql.guard'
import { CurrentUser } from '../auth/decorators/current-user'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Boolean, { name: 'createUser' })
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    await this.userService.create(createUserInput)
    return true
  }

  @Query(() => [User], { name: 'findAllUsers' })
  findAll() {
    return this.userService.findAll()
  }

  @Query(() => User, { name: 'findOneUser' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async updateUser(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput
  ) {
    await this.userService.update(user, updateUserInput)
    return true
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async removeUser(@CurrentUser() user: User) {
    await this.userService.remove(user)
    return true
  }
}
