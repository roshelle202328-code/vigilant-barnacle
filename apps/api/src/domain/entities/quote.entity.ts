// ═══════════════════════════════════════════════════════════════════════════════
// Domain Layer — Quote & QuoteItem Entities
// ═══════════════════════════════════════════════════════════════════════════════
//
// A Quote represents a formal price proposal sent to a client.
// Status flows: DRAFT → SENT → ACCEPTED | REJECTED | CONVERTED (to invoice).
// Each quote contains one or more QuoteItems, one per product line.
// ═══════════════════════════════════════════════════════════════════════════════

export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'CONVERTED';

export class QuoteItem {
  constructor(
    public readonly id: string,
    public readonly quoteId: string,
    public readonly productId: string,
    public readonly description: string,
    public readonly quantity: string,      // Decimal stored as string for precision
    public readonly unitPrice: string,     // Decimal stored as string for precision
    public readonly taxRate: string,       // Decimal stored as string for precision
    public readonly discountRate: string,  // Decimal stored as string for precision
    public readonly total: string,         // Decimal stored as string for precision
  ) {}
}

export class Quote {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly clientId: string,
    public readonly number: number,
    public readonly status: QuoteStatus,
    public readonly issueDate: Date,
    public readonly expirationDate: Date,
    public readonly subtotal: string,       // Decimal stored as string for precision
    public readonly taxTotal: string,       // Decimal stored as string for precision
    public readonly discountTotal: string,  // Decimal stored as string for precision
    public readonly total: string,          // Decimal stored as string for precision
    public readonly notes: string | null,
    public readonly terms: string | null,
    public readonly createdById: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly items: QuoteItem[],
  ) {}
}
