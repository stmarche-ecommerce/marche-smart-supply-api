import { Test, TestingModule } from '@nestjs/testing';
import { create } from 'domain';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../entities/role.enum';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';

const mockUsers = [
  {
    id: '1',
    name: 'Leo',
    role: Role.ADMIN,
    email: 'leo@mail.com',
    phone: null,
    description: null,
    first_access: true,
    token: null,
    expires_in_token: null,
    created_at: null,
    updated_at: null,
    username: 'leo',
    active: true,
    password: '12345',
  },
  {
    id: '1',
    name: 'any',
    role: Role.USER,
    email: 'any@mail.com',
    phone: null,
    description: null,
    first_access: true,
    token: null,
    expires_in_token: null,
    created_at: null,
    updated_at: null,
    username: 'any',
    active: true,
    password: '12345',
  },
];

const db = {
  users: {
    findMany: jest.fn().mockResolvedValue(mockUsers),
    count: jest.fn().mockResolvedValue(mockUsers.length),
    delete: jest.fn(),
    findFirst: jest.fn().mockResolvedValue(mockUsers[0]),
    findUnique: jest.fn().mockResolvedValue(mockUsers[0]),
    create: jest.fn((user) => {
      return user;
    }),
    update: jest.fn().mockResolvedValue(mockUsers[0]),
  },
};

const response = {
  json: jest.fn((json) => {
    return json;
  }),
  set: jest.fn(),
  setHeader: jest.fn(),
};

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('findAll', () => {
    const params = {
      response,
      search: '',
      resultsPerPage: 10,
      currentPageNumber: 1,
    };

    it('should return an array of users', async () => {
      const users = await usersService.findAll(params);
      expect(users).toEqual(mockUsers);
      expect(prismaService.users.findMany).toBeCalledTimes(1);
      expect(prismaService.users.count).toBeCalledTimes(1);
    });

    it('should throw new exception in findAll method', () => {
      jest.spyOn(usersService, 'findAll').mockRejectedValueOnce(new Error());

      expect(usersService.findAll(params)).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return an user', async () => {
      const user: any = await usersService.findOne(mockUsers[0].id);
      expect(user?.email).toEqual(mockUsers[0].email);
      expect(prismaService.users.findFirst).toBeCalledTimes(1);
    });

    it('should throw new exception in findOne method', () => {
      jest.spyOn(usersService, 'findOne').mockRejectedValueOnce(new Error());

      expect(usersService.findOne(mockUsers[0].id)).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create an user', async () => {
      jest.spyOn(prismaService.users, 'findFirst').mockResolvedValue(undefined);

      const result = await usersService.create(mockUsers[0]);
      expect(result).toEqual({
        data: {
          ...mockUsers[0],
          password: expect.any(String),
        },
      });
      expect(prismaService.users.findFirst).toBeCalledTimes(2);
      expect(prismaService.users.create).toBeCalledTimes(1);

      jest
        .spyOn(prismaService.users, 'findFirst')
        .mockResolvedValue(mockUsers[0]);
    });
  });

  describe('update', () => {
    it('should update an user', async () => {
      const result = await usersService.update(mockUsers[0].id, mockUsers[0]);
      expect(result).toEqual({
        ...mockUsers[0],
        token: undefined,
        expires_in_token: undefined,
        password: undefined,
      });
      expect(prismaService.users.findFirst).toBeCalledTimes(1);
      expect(prismaService.users.update).toBeCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete an user', async () => {
      const id = mockUsers[0].id;
      const result = await usersService.delete(id);
      expect(result).toBeUndefined();
      expect(prismaService.users.findFirst).toBeCalledTimes(1);
      expect(prismaService.users.delete).toBeCalledTimes(1);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const user: any = await usersService.findByEmail(mockUsers[0].email);
      expect(user?.email).toEqual(mockUsers[0].email);
      expect(prismaService.users.findUnique).toBeCalledTimes(1);
    });

    it('should throw new exception in findByEmail method', () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockRejectedValueOnce(new Error());

      expect(usersService.findByEmail(mockUsers[0].id)).rejects.toThrowError();
    });
  });
});
