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
import { MailService } from '../mail/mail.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: EntityRepository<User>,
    private mailService: MailService
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

    await this.userRepository.persistAndFlush(user)

    await this.mailService.sendRegisterEmail(user)
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

  async update(user: User, updateUserInput: UpdateUserInput): Promise<User> {
    if (updateUserInput.name) {
      user.name = updateUserInput.name
    }

    if (updateUserInput.email) {
      const userWithEmail = await this.userRepository.findOne({
        email: updateUserInput.email
      })

      if (!userWithEmail) {
        user.email = updateUserInput.email
      }

      if (!!userWithEmail && userWithEmail.id !== user.id) {
        throw new BadRequestException('Email already in use')
      }
    }

    if (updateUserInput.password) {
      user.password = await hash(updateUserInput.password, 10)
    }

    await this.userRepository.persistAndFlush(user)

    return user
  }

  async remove(user: User): Promise<void> {
    this.userRepository.remove(user)
    await this.userRepository.flush()
  }
}
