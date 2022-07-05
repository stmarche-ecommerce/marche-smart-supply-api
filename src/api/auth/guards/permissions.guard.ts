import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    if (isPublic || !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = await this.usersService.findOne(request?.user?.id);

    if (!user) return false;

    if (user?.role === 'ADMIN') return true;

    const parsedUserPermissions = user?.permissions?.map(
      (permission) => permission.name,
    );

    const hasAllPermissions = requiredPermissions?.every((permission) => {
      return parsedUserPermissions.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }

    return true;
  }

  handleRequest(err, user) {
    throw new UnauthorizedException(err?.message);
  }
}
