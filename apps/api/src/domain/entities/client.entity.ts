// ═══════════════════════════════════════════════════════════════════════════════
// Domain Layer — Client Entity
// ═══════════════════════════════════════════════════════════════════════════════
//
// The Client entity represents a customer of a company tenant.
// PERSONA_FISICA uses firstName/lastName, PERSONA_MORAL uses businessName.
// ═══════════════════════════════════════════════════════════════════════════════

export type ClientType = 'PERSONA_FISICA' | 'PERSONA_MORAL';

export class Client {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly type: ClientType,
    public readonly firstName: string | null,
    public readonly lastName: string | null,
    public readonly businessName: string | null,
    public readonly taxId: string,
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly address: string | null,
    public readonly notes: string | null,
    public readonly active: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
