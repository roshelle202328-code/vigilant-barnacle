// ═══════════════════════════════════════════════════════════════════════════════
// Domain Layer — Quote Repository Interface (Port)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Defines the contract for quote persistence operations.
// The infrastructure layer must fulfill this contract.
// ═══════════════════════════════════════════════════════════════════════════════

import type { Quote, QuoteItem, QuoteStatus } from '../entities/quote.entity';

export interface CreateQuoteItemInput {
  productId: string;
  description: string;
  quantity: string;
  unitPrice: string;
  taxRate: string;
  discountRate: string;
  total: string;
}

export interface CreateQuoteInput {
  companyId: string;
  clientId: string;
  number: number;
  issueDate: Date;
  expirationDate: Date;
  subtotal: string;
  taxTotal: string;
  discountTotal: string;
  total: string;
  notes?: string;
  terms?: string;
  createdById: string;
  items: CreateQuoteItemInput[];
}

export interface FindAllQuotesInput {
  companyId: string;
  page?: number;
  limit?: number;
  status?: QuoteStatus;
  clientId?: string;
  search?: string;
}

export interface PaginatedQuotes {
  quotes: Quote[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IQuoteRepository {
  create(data: CreateQuoteInput): Promise<Quote>;
  findById(id: string): Promise<Quote | null>;
  findByIdWithItems(id: string): Promise<Quote | null>;
  findByNumber(companyId: string, number: number): Promise<Quote | null>;
  findAll(input: FindAllQuotesInput): Promise<PaginatedQuotes>;
  countByCompany(companyId: string): Promise<number>;
  updateStatus(id: string, status: QuoteStatus): Promise<Quote>;
}

// ─── Token for NestJS DI ───────────────────────────────────────────────────────
export const IQUOTE_REPOSITORY_TOKEN = Symbol('IQuoteRepository');
