import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma/prisma.service';
import { UsersService } from '../../users/users.service';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

const authData = {
  email: 'test@gmail.com',
  password: '@Test123',
};

const accessToken = { accessToken: 'any-value' };

describe('AuthController', () => {
  let controller: AuthController;
  let prismaService: PrismaService;

  const mockUsersService = {
    findByEmail: () => Promise.resolve(authData),
  };

  let mockAuthService = {
    login: async (email: string, password: string) => {
      return accessToken;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        JwtService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockAuthService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('login', () => {
    it('should return access token', async () => {
      const result = await mockAuthService.login(
        authData.email,
        authData.password,
      );

      expect(result).toEqual(accessToken);
    });

    it('should throw new exception in login method', () => {
      jest.spyOn(mockAuthService, 'login').mockRejectedValueOnce(new Error());

      expect(
        mockAuthService.login(authData.email, authData.password),
      ).rejects.toThrowError();
    });
  });
});
