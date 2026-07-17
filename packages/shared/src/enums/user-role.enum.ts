export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  EMPLOYEE = 'EMPLOYEE',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Administrador',
  [UserRole.COMPANY_ADMIN]: 'Administrador de Empresa',
  [UserRole.ACCOUNTANT]: 'Contador',
  [UserRole.EMPLOYEE]: 'Empleado',
};
