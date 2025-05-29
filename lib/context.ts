// src/lib/context.ts
import { createContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Session } from 'next-auth';

export interface AppContextType {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  session: Session | null;
}

export const AppContext = createContext<AppContextType | null>(null);