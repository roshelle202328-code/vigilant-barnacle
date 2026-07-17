// ═══════════════════════════════════════════════════════════════════════════════
// Application Layer — DTOs
// ═══════════════════════════════════════════════════════════════════════════════
//
// Application-layer DTOs represent the shape of data crossing boundaries.
// They differ from presentation DTOs (NestJS) and shared DTOs (frontend).
// ═══════════════════════════════════════════════════════════════════════════════

// Placeholder — auth DTOs will be added in Sprint 1
export class RegisterCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly companyName: string,
    public readonly companyTaxId: string,
    public readonly country: string,
  ) {}
}

export class LoginQuery {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
