import { Injectable } from '@nestjs/common';
import {
  IUserRepository,
  CreateUserInput,
} from '@/domain/repositories/user.repository.interface';
import { User } from '@/domain/entities';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserInput): Promise<User> {
    const prismaUser = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    return new User(
      prismaUser.id,
      prismaUser.email,
      prismaUser.passwordHash,
      prismaUser.firstName,
      prismaUser.lastName,
      prismaUser.avatarUrl,
      prismaUser.emailVerified,
      prismaUser.active,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }
}
