import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(permissions: CreatePermissionDto[]) {
    const permissionList = await (
      await this.prisma.permissions.findMany({
        select: { name: true },
      })
    ).map((permission) => permission.name);

    const allPermissions = permissions.map((permission) => {
      if (!permissionList.includes(permission.name)) {
        return permission;
      }
    });

    return this.prisma.permissions.createMany({
      data: allPermissions,
    });
  }

  async assignPermissionToUser(userId: string, permissions) {
    await this.prisma.usersOnPermissions.deleteMany({
      where: { users_id: userId },
    });

    return this.prisma.usersOnPermissions.createMany({
      data: permissions.map((permission) => ({
        users_id: userId,
        permission_id: permission.permissionId,
      })),
    });
  }

  findAll() {
    return this.prisma.permissions.findMany();
  }

  async remove(id: string) {
    const permission = await this.prisma.permissions.findFirst({
      where: { id },
    });

    if (!permission) {
      return new HttpException('permission not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.permissions.delete({
      where: { id },
    });

    return;
  }
}
