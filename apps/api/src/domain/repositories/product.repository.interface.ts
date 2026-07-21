// ═══════════════════════════════════════════════════════════════════════════════
// Domain Layer — Product Repository Interface (Port)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Defines the contract for product persistence operations.
// The infrastructure layer must fulfill this contract.
// ═══════════════════════════════════════════════════════════════════════════════

import type { Product, ProductType, UnitType } from '../entities/product.entity';

export interface CreateProductInput {
  companyId: string;
  name: string;
  description?: string;
  sku?: string;
  type: ProductType;
  unit: UnitType;
  price: string;       // Decimal as string
  cost?: string;       // Decimal as string
  taxRate: string;     // Decimal as string
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  sku?: string;
  type?: ProductType;
  unit?: UnitType;
  price?: string;
  cost?: string;
  taxRate?: string;
}

export interface FindAllProductsInput {
  companyId: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IProductRepository {
  create(data: CreateProductInput): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findBySku(companyId: string, sku: string): Promise<Product | null>;
  findAll(input: FindAllProductsInput): Promise<PaginatedProducts>;
  update(id: string, data: UpdateProductInput): Promise<Product>;
  deactivate(id: string): Promise<Product>;
}

// ─── Token for NestJS DI ───────────────────────────────────────────────────────
export const IPRODUCT_REPOSITORY_TOKEN = Symbol('IProductRepository');
