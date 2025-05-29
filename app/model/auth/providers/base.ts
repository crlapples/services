// src/model/auth/providers/base.ts
import { Session } from 'next-auth';

export interface AuthProvider {
  getSession(): Promise<Session | null>;
}