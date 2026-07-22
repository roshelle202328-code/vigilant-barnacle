import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  IQuoteRepository,
  IQUOTE_REPOSITORY_TOKEN,
} from '@/domain/repositories/quote.repository.interface';
import {
  IClientRepository,
  ICLIENT_REPOSITORY_TOKEN,
} from '@/domain/repositories/client.repository.interface';
import {
  IProductRepository,
  IPRODUCT_REPOSITORY_TOKEN,
} from '@/domain/repositories/product.repository.interface';
import { CreateQuoteDto, CreateQuoteItemDto } from '@/application/dtos/quote/create-quote.dto';
import {
  QuoteResponseDto,
  QuoteItemResponseDto,
  QuoteStatusEnum,
} from '@/application/dtos/quote/create-quote.dto';
import type { QuoteStatus } from '@/domain/entities/quote.entity';

@Injectable()
export class CreateQuoteCommand {
  constructor(
    @Inject(IQUOTE_REPOSITORY_TOKEN)
    private readonly quoteRepository: IQuoteRepository,
    @Inject(ICLIENT_REPOSITORY_TOKEN)
    private readonly clientRepository: IClientRepository,
    @Inject(IPRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    dto: CreateQuoteDto,
    companyId: string,
    userId: string,
  ): Promise<QuoteResponseDto> {
    // ─── 1. Validate clientId belongs to company ────────────────────────────────
    const client = await this.clientRepository.findById(dto.clientId);
    if (!client || client.companyId !== companyId) {
      throw new NotFoundException(
        `Client with id "${dto.clientId}" not found in this company`,
      );
    }

    if (!client.active) {
      throw new BadRequestException(
        `Client with id "${dto.clientId}" is inactive`,
      );
    }

    // ─── 2. Validate each productId exists and is active ────────────────────────
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Quote must have at least one item');
    }

    const validatedItems: Array<{
      productId: string;
      description: string;
      quantity: string;
      unitPrice: string;
      taxRate: string;
      discountRate: string;
      total: string;
    }> = [];

    for (const item of dto.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product || product.companyId !== companyId) {
        throw new NotFoundException(
          `Product with id "${item.productId}" not found in this company`,
        );
      }

      if (!product.active) {
        throw new BadRequestException(
          `Product "${product.name}" (${item.productId}) is inactive`,
        );
      }

      const quantity = item.quantity.toString();
      const unitPrice = item.unitPrice.toString();
      const taxRate = (item.taxRate ?? 0).toString();
      const discountRate = (item.discountRate ?? 0).toString();

      // Calculate line total:
      // lineSubtotal = quantity * unitPrice
      // lineDiscount = lineSubtotal * (discountRate / 100)
      // lineTaxable = lineSubtotal - lineDiscount
      // lineTax = lineTaxable * (taxRate / 100)
      // lineTotal = lineTaxable + lineTax
      const qty = parseFloat(quantity);
      const up = parseFloat(unitPrice);
      const tr = parseFloat(taxRate);
      const dr = parseFloat(discountRate);

      const lineSubtotal = qty * up;
      const lineDiscount = lineSubtotal * (dr / 100);
      const lineTaxable = lineSubtotal - lineDiscount;
      const lineTax = lineTaxable * (tr / 100);
      const lineTotal = lineTaxable + lineTax;

      validatedItems.push({
        productId: item.productId,
        description: item.description,
        quantity,
        unitPrice,
        taxRate,
        discountRate,
        total: lineTotal.toFixed(2),
      });
    }

    // ─── 3. Calculate totals ────────────────────────────────────────────────────
    const subtotal = validatedItems.reduce(
      (sum, item) => sum + parseFloat(item.quantity) * parseFloat(item.unitPrice),
      0,
    );

    const discountTotal = validatedItems.reduce((sum, item) => {
      const lineSubtotal = parseFloat(item.quantity) * parseFloat(item.unitPrice);
      const dr = parseFloat(item.discountRate);
      return sum + lineSubtotal * (dr / 100);
    }, 0);

    const taxTotal = validatedItems.reduce((sum, item) => {
      const lineSubtotal = parseFloat(item.quantity) * parseFloat(item.unitPrice);
      const dr = parseFloat(item.discountRate);
      const lineDiscount = lineSubtotal * (dr / 100);
      const lineTaxable = lineSubtotal - lineDiscount;
      const tr = parseFloat(item.taxRate);
      return sum + lineTaxable * (tr / 100);
    }, 0);

    const total = subtotal - discountTotal + taxTotal;

    // ─── 4. Auto-generate sequential number per company ─────────────────────────
    const count = await this.quoteRepository.countByCompany(companyId);
    const number = count + 1;

    // ─── 5. Create quote with status DRAFT ──────────────────────────────────────
    const quote = await this.quoteRepository.create({
      companyId,
      clientId: dto.clientId,
      number,
      issueDate: new Date(dto.issueDate),
      expirationDate: new Date(dto.expirationDate),
      subtotal: subtotal.toFixed(2),
      taxTotal: taxTotal.toFixed(2),
      discountTotal: discountTotal.toFixed(2),
      total: total.toFixed(2),
      notes: dto.notes,
      terms: dto.terms,
      createdById: userId,
      items: validatedItems,
    });

    return this.toResponse(quote);
  }

  private toResponse(quote: {
    id: string;
    companyId: string;
    clientId: string;
    number: number;
    status: string;
    issueDate: Date;
    expirationDate: Date;
    subtotal: string;
    taxTotal: string;
    discountTotal: string;
    total: string;
    notes: string | null;
    terms: string | null;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    items: Array<{
      id: string;
      quoteId: string;
      productId: string;
      description: string;
      quantity: string;
      unitPrice: string;
      taxRate: string;
      discountRate: string;
      total: string;
    }>;
  }): QuoteResponseDto {
    return {
      id: quote.id,
      companyId: quote.companyId,
      clientId: quote.clientId,
      number: quote.number,
      status: quote.status as QuoteStatusEnum,
      issueDate: quote.issueDate.toISOString().split('T')[0],
      expirationDate: quote.expirationDate.toISOString().split('T')[0],
      subtotal: quote.subtotal,
      taxTotal: quote.taxTotal,
      discountTotal: quote.discountTotal,
      total: quote.total,
      notes: quote.notes,
      terms: quote.terms,
      createdById: quote.createdById,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
      items: quote.items.map((item) => ({
        id: item.id,
        quoteId: item.quoteId,
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        discountRate: item.discountRate,
        total: item.total,
      })),
    };
  }
}
