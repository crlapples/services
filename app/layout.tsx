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
        <title>Code Mage - Web Development Service</title>
        <meta
          name="description"
          content="Book web development services and explore website builds"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="app/favicon.ico" />
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