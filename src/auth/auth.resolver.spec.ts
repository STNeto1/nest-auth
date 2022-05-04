import { Test, TestingModule } from '@nestjs/testing'
import { AuthResolver } from './auth.resolver'
import { createMock } from '@golevelup/ts-jest'
import { AuthService } from './auth.service'
import { User } from '../user/entities/user.entity'

describe('AuthResolver', () => {
  let resolver: AuthResolver

  const userStub: User = {
    id: 1,
    name: 'user',
    email: 'mail@mail.com',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockedUserService = createMock<AuthService>({
    validateUser: jest.fn().mockResolvedValue({ access_token: 'jwt' })
  })

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockedUserService
        }
      ]
    }).compile()

    resolver = module.get<AuthResolver>(AuthResolver)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('login', () => {
    it('should return a access token for login', async () => {
      const result = await resolver.login({
        email: 'mail@mail.com',
        password: '102030'
      })

      expect(result).toStrictEqual({
        access_token: 'jwt'
      })
    })
  })

  describe('whoAmi', () => {
    it('should return logged user', async () => {
      const result = await resolver.whoAmi(userStub)

      expect(result).toStrictEqual(userStub)
    })
  })
})
