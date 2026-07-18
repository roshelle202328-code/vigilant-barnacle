// ═══════════════════════════════════════════════════════════════════════════════
// Domain Layer — Repository Interfaces (Ports)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Repository interfaces define contracts that infrastructure layer must fulfill.
// They belong to the domain because the domain defines WHAT to persist, not HOW.
// ═══════════════════════════════════════════════════════════════════════════════

import type { User } from '../entities';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}

export interface IUserRepository {
  createUser(data: CreateUserInput): Promise<User>;
}

// ─── Token for NestJS DI ───────────────────────────────────────────────────────
export const IUSER_REPOSITORY_TOKEN = Symbol('IUserRepository');
