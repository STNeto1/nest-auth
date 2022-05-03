import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import { InjectRepository } from '@mikro-orm/nestjs'
import { User } from './entities/user.entity'
import { EntityRepository } from '@mikro-orm/core'
import { hash } from 'bcryptjs'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: EntityRepository<User>
  ) {}

  async create(createUserInput: CreateUserInput) {
    const emailInUse = await this.userRepository.findOne({
      email: createUserInput.email
    })
    if (emailInUse) {
      throw new BadRequestException('Email already in use')
    }

    const hashedPassword = await hash(createUserInput.password, 10)
    const user = this.userRepository.create({
      name: createUserInput.name,
      email: createUserInput.email,
      password: hashedPassword
    })

    return this.userRepository.persistAndFlush(user)
  }

  findAll() {
    return `This action returns all user`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
