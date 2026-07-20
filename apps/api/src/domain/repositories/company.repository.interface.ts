// ═══════════════════════════════════════════════════════════════════════════════
// Domain Layer — Company Repository Interface (Port)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Defines the contract for company persistence operations.
// The infrastructure layer must fulfill this contract.
// ═══════════════════════════════════════════════════════════════════════════════

import type { Company } from '../entities';

export interface CreateCompanyInput {
  name: string;
  taxId: string;
  country: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

export interface UpdateCompanyInput {
  name?: string;
  taxId?: string;
  country?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  active?: boolean;
}

export interface ICompanyRepository {
  create(data: CreateCompanyInput): Promise<Company>;
  findById(id: string): Promise<Company | null>;
  findByTaxId(taxId: string): Promise<Company | null>;
  findAllForUser(userId: string): Promise<Company[]>;
  update(id: string, data: UpdateCompanyInput): Promise<Company>;
  deactivate(id: string): Promise<Company>;
}

// ─── Token for NestJS DI ───────────────────────────────────────────────────────
export const ICOMPANY_REPOSITORY_TOKEN = Symbol('ICompanyRepository');
