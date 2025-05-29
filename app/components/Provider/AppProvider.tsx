// src/components/AppProvider.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useMemo } from 'react';
import { CustomFlowbiteTheme, Flowbite } from 'flowbite-react';
import { AppContext } from 'lib/context';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { useSession } from 'next-auth/react';
import { firebaseConfig } from 'lib/firebase'; // Your Firebase config

const queryClient = new QueryClient();

const theme: CustomFlowbiteTheme = {
  checkbox: {
    root: {
      base: 'bg-gray-c2 text-gray-c1 !ring-stone-400 !ring-offset-stone-300',
    },
  },
  dropdown: {
    floating: {
      style: {
        auto: 'bg-gray-c2 min-w-fit -ml-4',
      },
    },
  },
};

export default function AppProvider({ children }: PropsWithChildren<{}>) {
  const { data: session } = useSession();

  const contextValue = useMemo(() => {
    const firebaseApp = initializeApp(firebaseConfig);
    const firestore = getFirestore(firebaseApp);
    return {
      firebaseApp,
      firestore,
      session,
    };
  }, [session]);

  return (
    <Flowbite theme={{ theme, dark: true }}>
      <AppContext.Provider value={contextValue}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AppContext.Provider>
    </Flowbite>
  );
}