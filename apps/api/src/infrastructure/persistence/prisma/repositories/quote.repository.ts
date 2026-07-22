import { Injectable } from '@nestjs/common';
import {
  IQuoteRepository,
  CreateQuoteInput,
  FindAllQuotesInput,
  PaginatedQuotes,
} from '@/domain/repositories/quote.repository.interface';
import { Quote, QuoteItem } from '@/domain/entities/quote.entity';
import type { QuoteStatus } from '@/domain/entities/quote.entity';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuoteRepository implements IQuoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateQuoteInput): Promise<Quote> {
    const prismaQuote = await this.prisma.quote.create({
      data: {
        companyId: data.companyId,
        clientId: data.clientId,
        number: data.number,
        status: 'DRAFT',
        issueDate: data.issueDate,
        expirationDate: data.expirationDate,
        subtotal: data.subtotal,
        taxTotal: data.taxTotal,
        discountTotal: data.discountTotal,
        total: data.total,
        notes: data.notes,
        terms: data.terms,
        createdById: data.createdById,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            discountRate: item.discountRate,
            total: item.total,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return this.toDomain(prismaQuote);
  }

  async findById(id: string): Promise<Quote | null> {
    const prismaQuote = await this.prisma.quote.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!prismaQuote) {
      return null;
    }

    return this.toDomain(prismaQuote);
  }

  async findByIdWithItems(id: string): Promise<Quote | null> {
    return this.findById(id); // items are always included via include
  }

  async findByNumber(companyId: string, number: number): Promise<Quote | null> {
    const prismaQuote = await this.prisma.quote.findUnique({
      where: {
        companyId_number: {
          companyId,
          number,
        },
      },
      include: { items: true },
    });

    if (!prismaQuote) {
      return null;
    }

    return this.toDomain(prismaQuote);
  }

  async findAll(input: FindAllQuotesInput): Promise<PaginatedQuotes> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      companyId: input.companyId,
    };

    if (input.status) {
      where.status = input.status;
    }

    if (input.clientId) {
      where.clientId = input.clientId;
    }

    if (input.search) {
      const searchNum = parseInt(input.search, 10);
      if (!isNaN(searchNum)) {
        where.number = searchNum;
      }
    }

    const [quotes, total] = await Promise.all([
      this.prisma.quote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      this.prisma.quote.count({ where }),
    ]);

    return {
      quotes: quotes.map((q) => this.toDomain(q)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async countByCompany(companyId: string): Promise<number> {
    return this.prisma.quote.count({
      where: { companyId },
    });
  }

  async updateStatus(id: string, status: QuoteStatus): Promise<Quote> {
    const prismaQuote = await this.prisma.quote.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    return this.toDomain(prismaQuote);
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private toDomain(prismaQuote: {
    id: string;
    companyId: string;
    clientId: string;
    number: number;
    status: string;
    issueDate: Date;
    expirationDate: Date;
    subtotal: unknown;
    taxTotal: unknown;
    discountTotal: unknown;
    total: unknown;
    notes: string | null;
    terms: string | null;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    items?: Array<{
      id: string;
      quoteId: string;
      productId: string;
      description: string;
      quantity: unknown;
      unitPrice: unknown;
      taxRate: unknown;
      discountRate: unknown;
      total: unknown;
    }>;
  }): Quote {
    const toDecimalStr = (v: unknown): string => {
      if (typeof v === 'string') return v;
      if (typeof v === 'number') return v.toString();
      if (v && typeof v === 'object' && 'toString' in (v as object)) {
        return (v as { toString(): string }).toString();
      }
      return '0';
    };

    return new Quote(
      prismaQuote.id,
      prismaQuote.companyId,
      prismaQuote.clientId,
      prismaQuote.number,
      prismaQuote.status as QuoteStatus,
      prismaQuote.issueDate,
      prismaQuote.expirationDate,
      toDecimalStr(prismaQuote.subtotal),
      toDecimalStr(prismaQuote.taxTotal),
      toDecimalStr(prismaQuote.discountTotal),
      toDecimalStr(prismaQuote.total),
      prismaQuote.notes,
      prismaQuote.terms,
      prismaQuote.createdById,
      prismaQuote.createdAt,
      prismaQuote.updatedAt,
      (prismaQuote.items ?? []).map(
        (item) =>
          new QuoteItem(
            item.id,
            item.quoteId,
            item.productId,
            item.description,
            toDecimalStr(item.quantity),
            toDecimalStr(item.unitPrice),
            toDecimalStr(item.taxRate),
            toDecimalStr(item.discountRate),
            toDecimalStr(item.total),
          ),
      ),
    );
  }
}
