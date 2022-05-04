import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { createMock } from '@golevelup/ts-jest'

import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { User } from '../user/entities/user.entity'

describe('AuthService', () => {
  let service: AuthService

  const userStub: User = {
    id: 1,
    name: 'user',
    email: 'mail@mail.com',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockedJwtService = createMock<JwtService>({
    sign: jest.fn().mockReturnValue('jwt')
  })
  const mockedUserService = createMock<UserService>({
    findByEmailAndPassword: jest.fn().mockReturnValue(userStub)
  })

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
        {
          provide: UserService,
          useValue: mockedUserService
        }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('validateUser', () => {
    it('should return a access token', async () => {
      const response = await service.validateUser({
        email: 'mail@mail.com',
        password: '102030'
      })

      expect(response.access_token).toEqual('jwt')
    })
  })
})
