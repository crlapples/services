// src/model/auth/server.ts
import getAuthSession from 'lib/auth';
import { AuthProvider } from './providers/base';

export class ServerAuthProvider implements AuthProvider {
  async getSession() {
    return await getAuthSession();
  }
}

export const authProvider = new ServerAuthProvider();