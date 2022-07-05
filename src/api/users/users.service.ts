import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User | HttpException> {
    const usernameAlreadyExists = await this.prisma.users.findFirst({
      where: {
        username: {
          equals: data.username,
        },
      },
    });

    if (usernameAlreadyExists) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    const emailAlreadyExists = await this.prisma.users.findFirst({
      where: {
        email: data.email,
      },
    });

    if (emailAlreadyExists) {
      throw new HttpException('E-mail already exists', HttpStatus.CONFLICT);
    }

    const createdUser = await this.prisma.users.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 10),
      },
    });

    return {
      ...createdUser,
      token: undefined,
      expires_in_token: undefined,
      password: undefined,
    };
  }

  async findAll({
    response,
    search = '',
    resultsPerPage = 10,
    currentPageNumber = 1,
  }): Promise<Response> {
    const countOfRegisters = await this.prisma.users.count({
      where: {
        OR: [
          { name: { startsWith: search } },
          { email: { startsWith: search } },
          { username: { startsWith: search } },
        ],
      },
    });
    const users = await this.prisma.users.findMany({
      skip: (Number(currentPageNumber) - 1) * Number(resultsPerPage),
      take: Number(resultsPerPage),
      orderBy: { created_at: 'desc' },
      where: {
        OR: [
          { name: { startsWith: search } },
          { email: { startsWith: search } },
          { username: { startsWith: search } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        role: true,
        created_at: true,
      },
    });

    response.set('Access-Control-Expose-Headers', 'X-Total-Count');
    response.setHeader('X-Total-Count', countOfRegisters);

    return response.json(users);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.users.findFirst({
      where: {
        id,
      },
      include: {
        permissions: {
          select: {
            permissions: true,
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      ...user,
      permissions: user?.permissions?.map(
        (permission) => permission.permissions,
      ),
      expires_in_token: undefined,
      token: undefined,
      password: undefined,
    };
  }

  async findByEmail(email: string): Promise<User | void> {
    const user = await this.prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        role: true,
        username: true,
        email: true,
        name: true,
        active: true,
        password: true,
        permissions: {
          select: {
            permissions: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return;
    }

    return {
      ...user,
      permissions: user?.permissions?.map(
        (permission) => permission.permissions,
      ),
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | HttpException> {
    const userExists = await this.prisma.users.findFirst({
      where: { id },
    });

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    });

    return {
      ...updatedUser,
      token: undefined,
      expires_in_token: undefined,
      password: undefined,
    };
  }

  async delete(id: string): Promise<void | HttpException> {
    const userExists = await this.prisma.users.findFirst({
      where: { id },
    });

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.users.delete({
      where: {
        id,
      },
    });

    return;
  }
}
