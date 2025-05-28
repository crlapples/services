// src/types/next-auth.d.ts
import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    profilePicture?: string;
  }

  interface Session {
    userId: string;
    profilePicture?: string;
    token?: string;
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    profilePicture?: string;
  }
}