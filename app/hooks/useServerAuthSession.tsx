// src/hooks/useServerAuthSession.ts
import getAuthSession from 'lib/auth';

export const useServerAuthSession = async () => {
  const session = await getAuthSession();
  return { session };
};