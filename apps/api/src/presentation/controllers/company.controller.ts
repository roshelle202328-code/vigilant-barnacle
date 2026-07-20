import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
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
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/presentation/guards/jwt-auth.guard';
import { CreateCompanyCommand } from '@/application/commands/company/create-company/create-company.command';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  CompanyResponseDto,
} from '@/application/dtos/company/create-company.dto';
import {
  ICompanyRepository,
  ICOMPANY_REPOSITORY_TOKEN,
} from '@/domain/repositories/company.repository.interface';
import { Inject } from '@nestjs/common';

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly createCompanyCommand: CreateCompanyCommand,
    @Inject(ICOMPANY_REPOSITORY_TOKEN)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiCreatedResponse({
    description: 'Company successfully created',
    type: CompanyResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiConflictResponse({ description: 'Tax ID already in use' })
  async create(
    @Body() dto: CreateCompanyDto,
    @Req() req: Request,
  ): Promise<CompanyResponseDto> {
    // req.user.sub is the authenticated user's id from JWT
    const userId = (req.user as { sub: string }).sub;
    return this.createCompanyCommand.execute(dto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "List the authenticated user's companies" })
  @ApiOkResponse({
    description: 'List of companies',
    type: CompanyResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  async findAll(@Req() req: Request): Promise<CompanyResponseDto[]> {
    const userId = (req.user as { sub: string }).sub;
    const companies = await this.companyRepository.findAllForUser(userId);
    return companies.map((c) => ({
      id: c.id,
      name: c.name,
      taxId: c.taxId,
      country: c.country,
      subscriptionTier: c.subscriptionTier,
      active: c.active,
      address: c.address,
      phone: c.phone,
      email: c.email,
      logoUrl: c.logoUrl,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiOkResponse({
    description: 'Company details',
    type: CompanyResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async findById(@Param('id') id: string): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundException(`Company with id "${id}" not found`);
    }
    return {
      id: company.id,
      name: company.name,
      taxId: company.taxId,
      country: company.country,
      subscriptionTier: company.subscriptionTier,
      active: company.active,
      address: company.address,
      phone: company.phone,
      email: company.email,
      logoUrl: company.logoUrl,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a company' })
  @ApiOkResponse({
    description: 'Company successfully updated',
    type: CompanyResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.update(id, dto);
    return {
      id: company.id,
      name: company.name,
      taxId: company.taxId,
      country: company.country,
      subscriptionTier: company.subscriptionTier,
      active: company.active,
      address: company.address,
      phone: company.phone,
      email: company.email,
      logoUrl: company.logoUrl,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}
