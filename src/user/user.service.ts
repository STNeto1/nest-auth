import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'
import { compare, hash } from 'bcryptjs'

import { CreateUserInput } from './dto/create-user.input'
import { UpdateUserInput } from './dto/update-user.input'
import { User } from './entities/user.entity'
import { LoginInput } from './dto/login.input'

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

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll()
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      id
    })

    if (!user) {
      throw new NotFoundException('User was not found')
    }

    return user
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      email
    })

    if (!user) {
      throw new NotFoundException('User was not found')
    }

    return user
  }

  async findByEmailAndPassword(data: LoginInput): Promise<User> {
    const exception = new BadRequestException('Invalid credentials')

    const user = await this.userRepository.findOne({
      email: data.email
    })

    if (!user) throw exception

    const validPwd = await compare(data.password, user.password)
    if (!validPwd) throw exception

    return user
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
