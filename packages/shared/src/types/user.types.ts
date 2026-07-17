import type { UserRole } from '../enums/user-role.enum';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithRole extends User {
  role: UserRole;
}
