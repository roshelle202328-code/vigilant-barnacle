// ═══════════════════════════════════════════════════════════════════════════════
// Domain Layer — Entities
// ═══════════════════════════════════════════════════════════════════════════════
//
// Domain entities encapsulate core business rules and are framework-agnostic.
// They should NOT import from NestJS, Prisma, or any infrastructure concern.
//
// For Sprint 0, entity definitions are lightweight — they will grow as business
// logic is implemented in subsequent sprints.
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

export class Company {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly taxId: string,
    public readonly country: string,
    public readonly subscriptionTier: string,
    public readonly active: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
