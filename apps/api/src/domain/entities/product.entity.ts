// ═══════════════════════════════════════════════════════════════════════════════
// Domain Layer — Product Entity
// ═══════════════════════════════════════════════════════════════════════════════
//
// Products and services sold by a company tenant.
// type discriminates PRODUCT from SERVICE; unit captures the unit of measure.
// price and cost are stored as Prisma Decimals (exposed as strings to preserve
// precision in the domain layer — conversion to number happens at the boundary).
// ═══════════════════════════════════════════════════════════════════════════════

export type ProductType = 'PRODUCT' | 'SERVICE';

export type UnitType =
  | 'PZA'
  | 'KG'
  | 'LT'
  | 'SERVICIO'
  | 'M'
  | 'M2'
  | 'M3'
  | 'CAJA'
  | 'PAR'
  | 'JUEGO'
  | 'HORA';

export class Product {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly sku: string | null,
    public readonly type: ProductType,
    public readonly unit: UnitType,
    public readonly price: string,       // Decimal stored as string for precision
    public readonly cost: string | null, // Decimal stored as string for precision
    public readonly taxRate: string,     // Decimal stored as string for precision
    public readonly active: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
