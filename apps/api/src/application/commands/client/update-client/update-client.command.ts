import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IClientRepository,
  ICLIENT_REPOSITORY_TOKEN,
} from '@/domain/repositories/client.repository.interface';
import { UpdateClientDto } from '@/application/dtos/client/create-client.dto';
import { ClientResponseDto, ClientTypeEnum } from '@/application/dtos/client/create-client.dto';

@Injectable()
export class UpdateClientCommand {
  constructor(
    @Inject(ICLIENT_REPOSITORY_TOKEN)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    const existing = await this.clientRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Client with id "${id}" not found`);
    }

    const client = await this.clientRepository.update(id, {
      type: dto.type,
      firstName: dto.firstName,
      lastName: dto.lastName,
      businessName: dto.businessName,
      taxId: dto.taxId,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      notes: dto.notes,
    });

    return this.toResponse(client);
  }

  private toResponse(client: {
    id: string;
    companyId: string;
    type: string;
    firstName: string | null;
    lastName: string | null;
    businessName: string | null;
    taxId: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    notes: string | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): ClientResponseDto {
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
}
