import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import { createMock } from '@golevelup/ts-jest'
import { EntityRepository } from '@mikro-orm/core'
import { User } from './entities/user.entity'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { CreateUserInput } from './dto/create-user.input'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { UpdateUserInput } from './dto/update-user.input'
import { MailService } from '../mail/mail.service'

describe('UserService', () => {
  let service: UserService

  const userStub: User = {
    id: 1,
    name: 'user',
    email: 'mail@mail.com',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockedUserRepository = createMock<EntityRepository<User>>()
  const mockedMailService = createMock<MailService>()

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockedUserRepository
        },
        {
          provide: MailService,
          useValue: mockedMailService
        }
      ]
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    const createInput: CreateUserInput = {
      name: 'name',
      email: 'mail@mail.com',
      password: '102030'
    }

    it('should throw BadRequestException if email already in use', async () => {
      mockedUserRepository.findOne.mockResolvedValue(userStub)

      await expect(service.create(createInput)).rejects.toThrow(
        BadRequestException
      )
    })

    it('should create a user', async () => {
      mockedUserRepository.findOne.mockResolvedValue(null)
      mockedUserRepository.create.mockReturnValue(userStub)

      await service.create(createInput)

      expect(mockedUserRepository.persistAndFlush).toHaveBeenCalled()
      expect(mockedMailService.sendRegisterEmail).toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should find all users', async () => {
      mockedUserRepository.findAll.mockResolvedValue([userStub])

      const result = await service.findAll()

      expect(result).toEqual([userStub])
    })
  })

  describe('findOne', () => {
    it('should throw NotFoundException if no user was found', async () => {
      mockedUserRepository.findOne.mockResolvedValue(null)

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException)
    })

    it('should return user for given id', async () => {
      mockedUserRepository.findOne.mockResolvedValue(userStub)

      const result = await service.findOne(1)

      expect(result).toStrictEqual(userStub)
    })
  })

  describe('findOneByEmail', () => {
    it('should throw NotFoundException if no user was found', async () => {
      mockedUserRepository.findOne.mockResolvedValue(null)

      await expect(service.findOneByEmail('invalid@mail.com')).rejects.toThrow(
        NotFoundException
      )
    })

    it('should return user for given email', async () => {
      mockedUserRepository.findOne.mockResolvedValue(userStub)

      const result = await service.findOneByEmail('mail@mail.com')

      expect(result).toStrictEqual(userStub)
    })
  })

  describe('findByEmailAndPassword', () => {
    it('should throw BadRequestException if no user was found', async () => {
      mockedUserRepository.findOne.mockResolvedValue(null)

      await expect(
        service.findByEmailAndPassword({
          email: 'invalid@mail.com',
          password: '102030'
        })
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw BadRequestException if password does not match', async () => {
      mockedUserRepository.findOne.mockResolvedValue(userStub)

      await expect(
        service.findByEmailAndPassword({
          email: 'invalid@mail.com',
          password: '102030'
        })
      ).rejects.toThrow(BadRequestException)
    })

    it('should return the user for the right credentials', async () => {
      const hashedPassword = await hash('102030', 10)
      const localUserStub = { ...userStub, password: hashedPassword }
      mockedUserRepository.findOne.mockResolvedValue(localUserStub)

      const result = await service.findByEmailAndPassword({
        email: 'valid@mail.com',
        password: '102030'
      })

      expect(result).toStrictEqual(localUserStub)
    })
  })

  describe('update', () => {
    const updateInput: UpdateUserInput = {
      name: 'new name',
      email: 'mail2@mail.com',
      password: '102030'
    }

    it('should throw BadRequestException if email already in use', async () => {
      const diffUserStub = { ...userStub, id: 2 }
      mockedUserRepository.findOne.mockResolvedValue(diffUserStub)

      await expect(service.update(userStub, updateInput)).rejects.toThrow(
        BadRequestException
      )
    })

    it('should update the user', async () => {
      mockedUserRepository.findOne.mockResolvedValue(null)

      await service.update(userStub, updateInput)

      expect(mockedUserRepository.findOne).toHaveBeenCalled()
      expect(mockedUserRepository.persistAndFlush).toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should remove the user', async () => {
      await service.remove(userStub)

      expect(mockedUserRepository.remove).toHaveBeenCalled()
      expect(mockedUserRepository.flush).toHaveBeenCalled()
    })
  })
})
