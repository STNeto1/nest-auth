import { Test, TestingModule } from '@nestjs/testing'
import { createMock } from '@golevelup/ts-jest'

import { UserResolver } from './user.resolver'
import { UserService } from './user.service'
import { User } from './entities/user.entity'

describe('UserResolver', () => {
  let resolver: UserResolver

  const userStub: User = {
    id: 1,
    name: 'user',
    email: 'mail@mail.com',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockedUserService = createMock<UserService>()

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: UserService, useValue: mockedUserService }
      ]
    }).compile()

    resolver = module.get<UserResolver>(UserResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('createUser', () => {
    it('should create a user', async () => {
      const result = await resolver.createUser({
        name: 'name',
        email: 'mail@mail.com',
        password: '102030'
      })

      expect(result).toEqual(true)
      expect(mockedUserService.create).toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should find all users', async () => {
      mockedUserService.findAll.mockResolvedValue([userStub])

      const result = await resolver.findAll()

      expect(result).toEqual([userStub])
    })
  })

  describe('findOne', () => {
    it('should find a user', async () => {
      mockedUserService.findOne.mockResolvedValue(userStub)

      const result = await resolver.findOne(1)

      expect(result).toStrictEqual(userStub)
    })
  })

  describe('updateUser', () => {
    it('should update a user', async () => {
      const result = await resolver.updateUser(userStub, {})

      expect(result).toEqual(true)
      expect(mockedUserService.update).toHaveBeenCalled()
    })
  })

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const result = await resolver.removeUser(userStub)

      expect(result).toEqual(true)
      expect(mockedUserService.remove).toHaveBeenCalled()
    })
  })
})
