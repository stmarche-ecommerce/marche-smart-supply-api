import { response } from 'express';
import { Role } from '../entities/role.enum';
import { User } from '../entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

const mockUsers: CreateUserDto[] = [
  {
    id: '1',
    name: 'Leo',
    role: Role.ADMIN,
    email: 'leo@mail.com',
    username: 'leo',
    active: true,
    password: '12345',
  },
  {
    id: '1',
    name: 'any',
    role: Role.USER,
    email: 'any@mail.com',
    username: 'any',
    active: true,
    password: '12345',
  },
];

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn(
      (query?: string, response?: any): Promise<User[] | Error> => {
        return Promise.resolve(mockUsers);
      },
    ),
    findOne: jest.fn((id): User | Promise<Error> => {
      return mockUsers.find((user) => user.id === id);
    }),
    create: jest.fn((dto: CreateUserDto): User | Promise<Error> => {
      return dto;
    }),
    delete: jest.fn((id: string): void | Promise<Error> => {
      return;
    }),
    update: jest.fn((id: string, dto): User | Promise<Error> => {
      return dto;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockUsersService).toBeDefined();
  });

  describe('findAll', () => {
    it('should list all users', async () => {
      const result = await controller.findAll('', response);
      expect(result).toEqual(mockUsers);
      expect(mockUsersService.findAll).toBeCalledTimes(1);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });

    it('should throw new exception in findAll method', () => {
      jest
        .spyOn(mockUsersService, 'findAll')
        .mockRejectedValueOnce(new Error());

      expect(mockUsersService.findAll('', response)).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should get one user', async () => {
      expect(controller.findOne('1')).toEqual(mockUsers[0]);
      expect(mockUsersService.findOne).toBeCalledTimes(1);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw new exception in findOne method', () => {
      jest
        .spyOn(mockUsersService, 'findOne')
        .mockRejectedValueOnce(new Error());

      expect(mockUsersService.findOne('1')).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create an user', () => {
      expect(controller.create(mockUsers[0])).toEqual(mockUsers[0]);
      expect(mockUsersService.create).toBeCalledTimes(1);
      expect(mockUsersService.create).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('should throw new exception in create method', () => {
      jest.spyOn(mockUsersService, 'create').mockRejectedValueOnce(new Error());

      expect(mockUsersService.create(mockUsers[0])).rejects.toThrowError();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('delete', () => {
    it('should delete an user', () => {
      const id = mockUsers[0].id;
      expect(controller.delete(id)).toBeUndefined();
      expect(mockUsersService.delete).toBeCalledTimes(1);
      expect(mockUsersService.delete).toHaveBeenCalledWith(id);
    });

    it('should throw new exception in delete method', () => {
      jest.spyOn(mockUsersService, 'delete').mockRejectedValueOnce(new Error());

      expect(mockUsersService.delete(mockUsers[0].id)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update an user', () => {
      expect(controller.update(mockUsers[0].id, mockUsers[0])).toEqual(
        mockUsers[0],
      );
      expect(mockUsersService.update).toBeCalledTimes(1);
      expect(mockUsersService.update).toBeCalledWith(
        mockUsers[0].id,
        mockUsers[0],
      );
    });

    it('should throw new exception in update method', () => {
      jest.spyOn(mockUsersService, 'update').mockRejectedValueOnce(new Error());

      expect(
        mockUsersService.update(mockUsers[0].id, mockUsers[0]),
      ).rejects.toThrowError();
    });
  });
});
