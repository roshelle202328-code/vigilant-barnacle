// ═══════════════════════════════════════════════════════════════════════════════
// Domain Layer — Client Repository Interface (Port)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Defines the contract for client persistence operations.
// The infrastructure layer must fulfill this contract.
// ═══════════════════════════════════════════════════════════════════════════════

import type { Client, ClientType } from '../entities/client.entity';

export interface CreateClientInput {
  companyId: string;
  type: ClientType;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  taxId: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface UpdateClientInput {
  type?: ClientType;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface FindAllClientsInput {
  companyId: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedClients {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IClientRepository {
  create(data: CreateClientInput): Promise<Client>;
  findById(id: string): Promise<Client | null>;
  findByTaxId(companyId: string, taxId: string): Promise<Client | null>;
  findAll(input: FindAllClientsInput): Promise<PaginatedClients>;
  update(id: string, data: UpdateClientInput): Promise<Client>;
  deactivate(id: string): Promise<Client>;
}

// ─── Token for NestJS DI ───────────────────────────────────────────────────────
export const ICLIENT_REPOSITORY_TOKEN = Symbol('IClientRepository');
