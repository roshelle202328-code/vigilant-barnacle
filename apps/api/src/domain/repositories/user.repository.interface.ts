// ═══════════════════════════════════════════════════════════════════════════════
// Domain Layer — Repository Interfaces (Ports)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Repository interfaces define contracts that infrastructure layer must fulfill.
// They belong to the domain because the domain defines WHAT to persist, not HOW.
// ═══════════════════════════════════════════════════════════════════════════════

import type { User } from '../entities';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
