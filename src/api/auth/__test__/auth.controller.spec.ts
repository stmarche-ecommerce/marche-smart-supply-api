import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma/prisma.service';
import { Role } from '../../users/entities/role.enum';
import { UsersService } from '../../users/users.service';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

const authData = {
  email: 'test@gmail.com',
  password: '@Test123',
};

const mockUser = {
  id: '1',
  name: 'any',
  role: Role.USER,
  email: 'any@mail.com',
  username: 'any',
  active: true,
  password: '12345',
};

const accessToken = { accessToken: 'any-value' };

describe('AuthController', () => {
  let controller: AuthController;

  let mockAuthService = {
    login: jest.fn((email: string, password: string) => {
      return accessToken;
    }),
  };

  const mockUsersService = {
    findOne: jest.fn((id) => {
      return mockUser;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, PrismaService],
      controllers: [AuthController],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockAuthService).toBeDefined();
  });

  describe('login', () => {
    it('should return access token', async () => {
      expect(controller.login(authData)).toEqual(accessToken);

      expect(mockAuthService.login).toBeCalledTimes(1);
      expect(mockAuthService.login).toBeCalledWith(authData);
    });

    it('should throw new exception in login method', () => {
      jest.spyOn(controller, 'login').mockRejectedValueOnce(new Error());

      expect(controller.login(authData)).rejects.toThrowError();
    });
  });

  describe('getMe', () => {
    it('should return user datails', () => {
      expect(controller.getMe(mockUser)).toEqual(mockUser);
    });

    it('should throw new exception in getMe method', () => {
      jest.spyOn(controller, 'getMe').mockRejectedValueOnce(new Error());

      expect(controller.getMe(mockUser)).rejects.toThrowError();
    });
  });
});
