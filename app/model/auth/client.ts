import { getServerSession } from './session';

export const getServerAuthClient = () => {
  return {
    getCurrentUser: async () => {
      const session = await getServerSession();
      if (!session) return null;
      
      // Fetch additional user data from your database if needed
      return {
        id: session.userId,
        email: session.email,
        name: session.name,
        // Add other user fields
      };
    },
    // Add other auth methods as needed
  };
};

export type AuthClientType = ReturnType<typeof getServerAuthClient>;