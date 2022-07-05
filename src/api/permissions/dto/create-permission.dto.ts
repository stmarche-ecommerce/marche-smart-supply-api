import { Prisma } from '@prisma/client';

export class CreatePermissionDto implements Prisma.PermissionsCreateManyInput {
  name: string;
  description?: string;
}
