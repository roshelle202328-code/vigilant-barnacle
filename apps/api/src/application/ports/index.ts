// ═══════════════════════════════════════════════════════════════════════════════
// Application Layer — Ports (Interfaces for external services)
// ═══════════════════════════════════════════════════════════════════════════════

export interface EmailPort {
  sendVerificationEmail(email: string, token: string): Promise<void>;
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
}

export interface StoragePort {
  uploadFile(key: string, buffer: Buffer, contentType: string): Promise<string>;
  getSignedUrl(key: string, expiresIn: number): Promise<string>;
  deleteFile(key: string): Promise<void>;
}

export interface EventBusPort {
  publish(eventName: string, payload: Record<string, unknown>): Promise<void>;
  subscribe(eventName: string, handler: (payload: unknown) => Promise<void>): void;
}
