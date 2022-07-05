import { Prisma } from '@prisma/client';

export class User implements Prisma.UsersUncheckedCreateInput {
  id?: string;
  name: string;
  email: string;
  role?: string;
  active?: boolean;
  first_access?: boolean;
  permissions?: any;
  phone?: string;
  username: string;
  password: string;
  token?: string;
  expires_in_token?: Date;
  description?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
}
