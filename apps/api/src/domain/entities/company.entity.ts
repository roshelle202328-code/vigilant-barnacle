// ═══════════════════════════════════════════════════════════════════════════════
// Domain Layer — Company Entity
// ═══════════════════════════════════════════════════════════════════════════════
//
// The Company entity represents a tenant in the multi-tenant SaaS.
// It is framework-agnostic and does NOT import from NestJS, Prisma, or any
// infrastructure concern.
// ═══════════════════════════════════════════════════════════════════════════════

export class Company {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly taxId: string,
    public readonly country: string,
    public readonly subscriptionTier: string,
    public readonly active: boolean,
    public readonly address: string | null,
    public readonly phone: string | null,
    public readonly email: string | null,
    public readonly logoUrl: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
