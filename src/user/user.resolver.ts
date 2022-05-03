import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserService } from './user.service'
import { User } from './entities/user.entity'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'

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

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.userService.update(updateUserInput.id, updateUserInput)
  // }
  //
  // @Mutation(() => User)
  // removeUser(@Args('id', { type: () => Int }) id: number) {
  //   return this.userService.remove(id)
  // }
}
