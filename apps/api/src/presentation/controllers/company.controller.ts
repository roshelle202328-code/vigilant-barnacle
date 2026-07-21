import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { InviteUserCommand } from '@/application/commands/company/invite-user/invite-user.command';
import { AcceptInvitationCommand } from '@/application/commands/company/accept-invitation/accept-invitation.command';
import { UpdateRoleCommand } from '@/application/commands/company/update-role/update-role.command';
import { RemoveUserCommand } from '@/application/commands/company/remove-user/remove-user.command';
import {
  CreateCompanyDto,
  UpdateCompanyDto,
  CompanyResponseDto,
} from '@/application/dtos/company/create-company.dto';
import {
  InviteUserDto,
  UpdateRoleDto,
  InvitationResponseDto,
  UserWithRoleDto,
} from '@/application/dtos/company/invitation.dto';
import {
  ICompanyRepository,
  ICOMPANY_REPOSITORY_TOKEN,
} from '@/domain/repositories/company.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/persistence/prisma/prisma.service';

@ApiTags('Companies')
@Controller('companies')
@Injectable()
export class CompanyController {
  constructor(
    private readonly createCompanyCommand: CreateCompanyCommand,
    private readonly inviteUserCommand: InviteUserCommand,
    private readonly acceptInvitationCommand: AcceptInvitationCommand,
    private readonly updateRoleCommand: UpdateRoleCommand,
    private readonly removeUserCommand: RemoveUserCommand,
    @Inject(ICOMPANY_REPOSITORY_TOKEN)
    private readonly companyRepository: ICompanyRepository,
    private readonly prisma: PrismaService,
  ) {}

  // ─── Company CRUD ──────────────────────────────────────────────────────────

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
  @ApiConflictResponse({
    description: 'A company with this tax ID already exists',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  async create(
    @Body() dto: CreateCompanyDto,
    @Req() req: Request,
  ): Promise<CompanyResponseDto> {
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

  // ─── User Invitation & Role Management ─────────────────────────────────────

  @Post(':id/invite')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite a user to the company' })
  @ApiCreatedResponse({
    description: 'User invited or added directly',
  })
  @ApiBadRequestResponse({ description: 'Validation error or invalid role' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiConflictResponse({
    description: 'User already has a role or pending invitation exists',
  })
  async inviteUser(
    @Param('id') companyId: string,
    @Body() dto: InviteUserDto,
    @Req() req: Request,
  ): Promise<InvitationResponseDto | { message: string }> {
    const inviterUserId = (req.user as { sub: string }).sub;
    return this.inviteUserCommand.execute(dto, companyId, inviterUserId);
  }

  @Get(':id/users')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List company users with roles' })
  @ApiOkResponse({
    description: 'List of users with their roles in the company',
    type: UserWithRoleDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  async listUsers(
    @Param('id') companyId: string,
  ): Promise<UserWithRoleDto[]> {
    const roles = await this.prisma.userCompanyRole.findMany({
      where: { companyId },
      include: { user: true },
    });

    return roles.map((r) => ({
      userId: r.userId,
      email: r.user.email,
      firstName: r.user.firstName,
      lastName: r.user.lastName,
      role: r.role,
      roleId: r.id,
    }));
  }

  @Put(':id/users/:userId/role')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a user's role in the company" })
  @ApiOkResponse({ description: 'Role updated successfully' })
  @ApiBadRequestResponse({ description: 'Validation error or invalid role' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiNotFoundResponse({ description: 'User does not belong to this company' })
  async updateRole(
    @Param('id') companyId: string,
    @Param('userId') targetUserId: string,
    @Body() dto: UpdateRoleDto,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const callerUserId = (req.user as { sub: string }).sub;
    return this.updateRoleCommand.execute(
      companyId,
      targetUserId,
      dto,
      callerUserId,
    );
  }

  @Delete(':id/users/:userId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a user from the company' })
  @ApiOkResponse({ description: 'User removed successfully' })
  @ApiBadRequestResponse({
    description: 'Cannot remove last COMPANY_ADMIN',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiNotFoundResponse({ description: 'User does not belong to this company' })
  async removeUser(
    @Param('id') companyId: string,
    @Param('userId') targetUserId: string,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const callerUserId = (req.user as { sub: string }).sub;
    return this.removeUserCommand.execute(companyId, targetUserId, callerUserId);
  }
}

// ─── Separate controller for invitation acceptance (token-based, no company ID) ─

@ApiTags('Invitations')
@Controller('invitations')
@Injectable()
export class InvitationController {
  constructor(
    private readonly acceptInvitationCommand: AcceptInvitationCommand,
  ) {}

  @Post(':token/accept')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept an invitation by token' })
  @ApiOkResponse({ description: 'Invitation accepted successfully' })
  @ApiBadRequestResponse({
    description: 'Invitation expired, already accepted, or email mismatch',
  })
  @ApiNotFoundResponse({ description: 'Invitation not found' })
  async acceptInvitation(
    @Param('token') token: string,
    @Req() req: Request,
  ): Promise<{ message: string; companyId: string }> {
    const userId = (req.user as { sub: string }).sub;
    return this.acceptInvitationCommand.execute(token, userId);
  }
}
