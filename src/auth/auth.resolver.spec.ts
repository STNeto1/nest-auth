import { Test, TestingModule } from '@nestjs/testing'
import { AuthResolver } from './auth.resolver'
import { createMock } from '@golevelup/ts-jest'
import { AuthService } from './auth.service'

describe('AuthResolver', () => {
  let resolver: AuthResolver

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

      expect(result.access_token).toEqual('jwt')
    })
  })
})
