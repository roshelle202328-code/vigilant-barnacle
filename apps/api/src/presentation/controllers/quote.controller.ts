import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/presentation/guards/jwt-auth.guard';
import { CreateQuoteCommand } from '@/application/commands/quote/create-quote/create-quote.command';
import {
  CreateQuoteDto,
  UpdateQuoteStatusDto,
  QuoteResponseDto,
  QuoteItemResponseDto,
  FindAllQuotesQueryDto,
  PaginatedQuotesResponseDto,
  QuoteStatusEnum,
} from '@/application/dtos/quote/create-quote.dto';
import {
  IQuoteRepository,
  IQUOTE_REPOSITORY_TOKEN,
} from '@/domain/repositories/quote.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@ApiTags('Quotes')
@Controller('quotes')
@Injectable()
export class QuoteController {
  constructor(
    private readonly createQuoteCommand: CreateQuoteCommand,
    @Inject(IQUOTE_REPOSITORY_TOKEN)
    private readonly quoteRepository: IQuoteRepository,
  ) {}

  // ─── Create ──────────────────────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-company-id', description: 'Company ID (tenant context)', required: true })
  @ApiOperation({ summary: 'Create a new quote' })
  @ApiCreatedResponse({
    description: 'Quote successfully created',
    type: QuoteResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  async create(
    @Body() dto: CreateQuoteDto,
    @Headers('x-company-id') companyId: string,
  ): Promise<QuoteResponseDto> {
    if (!companyId) {
      throw new NotFoundException('Company ID header (x-company-id) is required');
    }
    // userId would come from JWT in production; use a placeholder for now
    const userId = 'system';
    return this.createQuoteCommand.execute(dto, companyId, userId);
  }

  // ─── List (paginated) ────────────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-company-id', description: 'Company ID (tenant context)', required: true })
  @ApiOperation({ summary: 'List quotes (paginated, filterable by company)' })
  @ApiOkResponse({
    description: 'Paginated list of quotes',
    type: PaginatedQuotesResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  async findAll(
    @Headers('x-company-id') companyId: string,
    @Query() query: FindAllQuotesQueryDto,
  ): Promise<PaginatedQuotesResponseDto> {
    if (!companyId) {
      throw new NotFoundException('Company ID header (x-company-id) is required');
    }

    const result = await this.quoteRepository.findAll({
      companyId,
      page: query.page,
      limit: query.limit,
      status: query.status as QuoteStatusEnum | undefined,
      clientId: query.clientId,
      search: query.search,
    });

    return {
      quotes: result.quotes.map((q) => ({
        id: q.id,
        companyId: q.companyId,
        clientId: q.clientId,
        number: q.number,
        status: q.status as QuoteStatusEnum,
        issueDate: q.issueDate instanceof Date ? q.issueDate.toISOString().split('T')[0] : String(q.issueDate),
        expirationDate: q.expirationDate instanceof Date ? q.expirationDate.toISOString().split('T')[0] : String(q.expirationDate),
        subtotal: q.subtotal,
        taxTotal: q.taxTotal,
        discountTotal: q.discountTotal,
        total: q.total,
        notes: q.notes,
        terms: q.terms,
        createdById: q.createdById,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
        items: q.items.map((item) => ({
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
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  // ─── Get by ID ───────────────────────────────────────────────────────────────

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a quote by ID (with items)' })
  @ApiOkResponse({
    description: 'Quote details with items',
    type: QuoteResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  async findById(@Param('id') id: string): Promise<QuoteResponseDto> {
    const quote = await this.quoteRepository.findByIdWithItems(id);
    if (!quote) {
      throw new NotFoundException(`Quote with id "${id}" not found`);
    }

    return {
      id: quote.id,
      companyId: quote.companyId,
      clientId: quote.clientId,
      number: quote.number,
      status: quote.status as QuoteStatusEnum,
      issueDate: quote.issueDate instanceof Date ? quote.issueDate.toISOString().split('T')[0] : String(quote.issueDate),
      expirationDate: quote.expirationDate instanceof Date ? quote.expirationDate.toISOString().split('T')[0] : String(quote.expirationDate),
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

  // ─── Update Status (DRAFT→SENT→ACCEPTED/REJECTED/CONVERTED) ──────────────────

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update quote status (DRAFT→SENT→ACCEPTED/REJECTED/CONVERTED)' })
  @ApiOkResponse({
    description: 'Quote status updated',
    type: QuoteResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid status transition' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateQuoteStatusDto,
  ): Promise<QuoteResponseDto> {
    const quote = await this.quoteRepository.findById(id);
    if (!quote) {
      throw new NotFoundException(`Quote with id "${id}" not found`);
    }

    // Validate status transitions
    const currentStatus = quote.status;
    const newStatus = dto.status as QuoteStatusEnum;

    const validTransitions: Record<string, QuoteStatusEnum[]> = {
      DRAFT: [QuoteStatusEnum.SENT, QuoteStatusEnum.REJECTED],
      SENT: [QuoteStatusEnum.ACCEPTED, QuoteStatusEnum.REJECTED],
      ACCEPTED: [QuoteStatusEnum.CONVERTED],
      REJECTED: [],
      CONVERTED: [],
    };

    const allowed = validTransitions[currentStatus] ?? [];
    if (!allowed.includes(newStatus)) {
      throw new NotFoundException(
        `Cannot transition quote from "${currentStatus}" to "${newStatus}". ` +
        `Allowed transitions: ${allowed.join(', ') || 'none'}`,
      );
    }

    const updated = await this.quoteRepository.updateStatus(id, newStatus);

    return {
      id: updated.id,
      companyId: updated.companyId,
      clientId: updated.clientId,
      number: updated.number,
      status: updated.status as QuoteStatusEnum,
      issueDate: updated.issueDate instanceof Date ? updated.issueDate.toISOString().split('T')[0] : String(updated.issueDate),
      expirationDate: updated.expirationDate instanceof Date ? updated.expirationDate.toISOString().split('T')[0] : String(updated.expirationDate),
      subtotal: updated.subtotal,
      taxTotal: updated.taxTotal,
      discountTotal: updated.discountTotal,
      total: updated.total,
      notes: updated.notes,
      terms: updated.terms,
      createdById: updated.createdById,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      items: updated.items.map((item) => ({
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
