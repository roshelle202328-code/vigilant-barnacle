// ═══════════════════════════════════════════════════════════════════════════════
// Domain Layer — User Entity
// ═══════════════════════════════════════════════════════════════════════════════
//
// The User entity encapsulates core identity and is framework-agnostic.
// It does NOT import from NestJS, Prisma, or any infrastructure concern.
// ═══════════════════════════════════════════════════════════════════════════════

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly avatarUrl: string | null,
    public readonly emailVerified: boolean,
    public readonly active: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
