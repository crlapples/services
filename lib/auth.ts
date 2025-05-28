// src/lib/auth.ts (abridged)
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Firebase',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
          const user = userCredential.user;
          return {
            id: user.uid,
            email: user.email ?? undefined,
            name: user.displayName ?? undefined,
            profilePicture: user.photoURL ?? undefined,
          };
        } catch (error) {
          console.error('Firebase auth error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.profilePicture = user.profilePicture;
      }
      return token;
    },
    async session({ session, token }) {
      session.userId = token.id;
      session.profilePicture = token.profilePicture;
      session.token = token.sub;
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authOptions);