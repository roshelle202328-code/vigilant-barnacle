import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
  ApiConflictResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/presentation/guards/jwt-auth.guard';
import { CreateProductCommand } from '@/application/commands/product/create-product/create-product.command';
import { UpdateProductCommand } from '@/application/commands/product/update-product/update-product.command';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
  FindAllProductsQueryDto,
  PaginatedProductsResponseDto,
  ProductTypeEnum,
  UnitTypeEnum,
} from '@/application/dtos/product/create-product.dto';
import {
  IProductRepository,
  IPRODUCT_REPOSITORY_TOKEN,
} from '@/domain/repositories/product.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@ApiTags('Products')
@Controller('products')
@Injectable()
export class ProductController {
  constructor(
    private readonly createProductCommand: CreateProductCommand,
    private readonly updateProductCommand: UpdateProductCommand,
    @Inject(IPRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  // ─── Create ────────────────────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-company-id', description: 'Company ID (tenant context)', required: true })
  @ApiOperation({ summary: 'Create a new product' })
  @ApiCreatedResponse({
    description: 'Product successfully created',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiConflictResponse({
    description: 'A product with this SKU already exists in the company',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  async create(
    @Body() dto: CreateProductDto,
    @Headers('x-company-id') companyId: string,
  ): Promise<ProductResponseDto> {
    if (!companyId) {
      throw new NotFoundException('Company ID header (x-company-id) is required');
    }
    return this.createProductCommand.execute(dto, companyId);
  }

  // ─── List (paginated) ──────────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-company-id', description: 'Company ID (tenant context)', required: true })
  @ApiOperation({ summary: 'List products (paginated, filtered by company)' })
  @ApiOkResponse({
    description: 'Paginated list of products',
    type: PaginatedProductsResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  async findAll(
    @Headers('x-company-id') companyId: string,
    @Query() query: FindAllProductsQueryDto,
  ): Promise<PaginatedProductsResponseDto> {
    if (!companyId) {
      throw new NotFoundException('Company ID header (x-company-id) is required');
    }

    const result = await this.productRepository.findAll({
      companyId,
      page: query.page,
      limit: query.limit,
      search: query.search,
    });

    return {
      products: result.products.map((p) => ({
        id: p.id,
        companyId: p.companyId,
        name: p.name,
        description: p.description,
        sku: p.sku,
        type: p.type as ProductTypeEnum,
        unit: p.unit as UnitTypeEnum,
        price: p.price,
        cost: p.cost,
        taxRate: p.taxRate,
        active: p.active,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  // ─── Get by ID ─────────────────────────────────────────────────────────────

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiOkResponse({
    description: 'Product details',
    type: ProductResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async findById(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    return {
      id: product.id,
      companyId: product.companyId,
      name: product.name,
      description: product.description,
      sku: product.sku,
      type: product.type as ProductTypeEnum,
      unit: product.unit as UnitTypeEnum,
      price: product.price,
      cost: product.cost,
      taxRate: product.taxRate,
      active: product.active,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  // ─── Update ────────────────────────────────────────────────────────────────

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiOkResponse({
    description: 'Product successfully updated',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.updateProductCommand.execute(id, dto);
  }

  // ─── Soft-delete (deactivate) ──────────────────────────────────────────────

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a product (soft-delete)' })
  @ApiOkResponse({ description: 'Product deactivated successfully' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async deactivate(@Param('id') id: string): Promise<{ message: string }> {
    await this.productRepository.deactivate(id);
    return { message: 'Product deactivated successfully' };
  }
}
