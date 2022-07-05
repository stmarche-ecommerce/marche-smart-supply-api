import { Prisma } from '@prisma/client';

export class Permission implements Prisma.PermissionsUncheckedUpdateInput {
  id?: string;
  name: string;
  description?: string | Prisma.NullableStringFieldUpdateOperationsInput;
}
