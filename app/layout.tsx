'use client'

import './globals.css';
import Footer from 'app/components/Layout/Footer';
import Header from 'app/components/Layout/Header';
import { SessionProvider } from 'next-auth/react';

// Manually opt out static rendering to reflect business asset changes immediately
export const revalidate = 0;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Fitness & Training Platform</title>
        <meta
          name="description"
          content="Book fitness services and explore training plans"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="parallax-background">
        <SessionProvider>
          <Header />
          <main className="bg-transparent min-h-[600px]">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}