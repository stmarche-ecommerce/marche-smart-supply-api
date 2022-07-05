import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './entities/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | any {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    // const { user } = context.switchToHttp().getRequest();
    const user = {
      name: 'Leo santos',
      roles: [Role.ADMIN],
    };

    console.log(user);
    console.log(requiredRoles);

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
