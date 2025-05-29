// src/providers/next-auth.ts
import NextAuth from 'next-auth';
import { authOptions } from 'lib/auth';

// Export the handler
export default NextAuth(authOptions);

// Add this if you're still getting the isolatedModules error
export {};