import { cookies } from 'next/headers';
import { AUTH_SESSION_COOKIE } from './constants';

export interface AuthSession {
  userId: string;
  email: string;
  name?: string;
  expiresAt: Date;
  roles?: string[];
}

export const getServerSession = async (): Promise<AuthSession | null> => {
  const sessionCookie = cookies().get(AUTH_SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;
  
  try {
    // In production, verify the session token with your auth provider
    return JSON.parse(sessionCookie) as AuthSession;
  } catch (error) {
    console.error('Invalid session cookie', error);
    return null;
  }
};