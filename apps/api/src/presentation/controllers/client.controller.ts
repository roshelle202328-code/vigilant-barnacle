import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  Headers,
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
  ApiHeader,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/presentation/guards/jwt-auth.guard';
import { CreateClientCommand } from '@/application/commands/client/create-client/create-client.command';
import { UpdateClientCommand } from '@/application/commands/client/update-client/update-client.command';
import {
  CreateClientDto,
  UpdateClientDto,
  ClientResponseDto,
  FindAllClientsQueryDto,
  PaginatedClientsResponseDto,
  ClientTypeEnum,
} from '@/application/dtos/client/create-client.dto';
import {
  IClientRepository,
  ICLIENT_REPOSITORY_TOKEN,
} from '@/domain/repositories/client.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@ApiTags('Clients')
@Controller('clients')
@Injectable()
export class ClientController {
  constructor(
    private readonly createClientCommand: CreateClientCommand,
    private readonly updateClientCommand: UpdateClientCommand,
    @Inject(ICLIENT_REPOSITORY_TOKEN)
    private readonly clientRepository: IClientRepository,
  ) {}

  // ─── Create ────────────────────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-company-id', description: 'Company ID (tenant context)', required: true })
  @ApiOperation({ summary: 'Create a new client' })
  @ApiCreatedResponse({
    description: 'Client successfully created',
    type: ClientResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiConflictResponse({
    description: 'A client with this tax ID already exists in the company',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  async create(
    @Body() dto: CreateClientDto,
    @Headers('x-company-id') companyId: string,
  ): Promise<ClientResponseDto> {
    if (!companyId) {
      throw new NotFoundException('Company ID header (x-company-id) is required');
    }
    return this.createClientCommand.execute(dto, companyId);
  }

  // ─── List (paginated) ──────────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiHeader({ name: 'x-company-id', description: 'Company ID (tenant context)', required: true })
  @ApiOperation({ summary: 'List clients (paginated, filtered by company)' })
  @ApiOkResponse({
    description: 'Paginated list of clients',
    type: PaginatedClientsResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  async findAll(
    @Headers('x-company-id') companyId: string,
    @Query() query: FindAllClientsQueryDto,
  ): Promise<PaginatedClientsResponseDto> {
    if (!companyId) {
      throw new NotFoundException('Company ID header (x-company-id) is required');
    }

    const result = await this.clientRepository.findAll({
      companyId,
      page: query.page,
      limit: query.limit,
      search: query.search,
    });

    return {
      clients: result.clients.map((c) => ({
        id: c.id,
        companyId: c.companyId,
        type: c.type as ClientTypeEnum,
        firstName: c.firstName,
        lastName: c.lastName,
        businessName: c.businessName,
        taxId: c.taxId,
        email: c.email,
        phone: c.phone,
        address: c.address,
        notes: c.notes,
        active: c.active,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
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
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiOkResponse({
    description: 'Client details',
    type: ClientResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiNotFoundResponse({ description: 'Client not found' })
  async findById(@Param('id') id: string): Promise<ClientResponseDto> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with id "${id}" not found`);
    }
    return {
      id: client.id,
      companyId: client.companyId,
      type: client.type as ClientTypeEnum,
      firstName: client.firstName,
      lastName: client.lastName,
      businessName: client.businessName,
      taxId: client.taxId,
      email: client.email,
      phone: client.phone,
      address: client.address,
      notes: client.notes,
      active: client.active,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }

  // ─── Update ────────────────────────────────────────────────────────────────

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a client' })
  @ApiOkResponse({
    description: 'Client successfully updated',
    type: ClientResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiNotFoundResponse({ description: 'Client not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    return this.updateClientCommand.execute(id, dto);
  }

  // ─── Soft-delete (deactivate) ──────────────────────────────────────────────

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a client (soft-delete)' })
  @ApiOkResponse({ description: 'Client deactivated successfully' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiNotFoundResponse({ description: 'Client not found' })
  async deactivate(@Param('id') id: string): Promise<{ message: string }> {
    await this.clientRepository.deactivate(id);
    return { message: 'Client deactivated successfully' };
  }
}
