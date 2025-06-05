// app/layout.tsx
'use client'; // Keep this if SessionProvider or other client components are essential here

import './globals.css';
import Footer from 'app/components/Layout/Footer';
import Header from 'app/components/Layout/Header';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation'; // Import usePathname for client components

// Manually opt out static rendering to reflect business asset changes immediately
// export const revalidate = 0; // This is a page/route segment config, not for layout directly.
// If you need dynamic rendering for the layout itself due to headers(), it becomes dynamic.
// If layout is 'use client', revalidate won't apply here.

// Note: If you make RootLayout a server component to use headers(),
// SessionProvider would need to be wrapped in its own client component.
// For simplicity with your existing 'use client', we'll use usePathname.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Hook for client components to get current path

  // Define paths that should have a minimal or custom layout
  // (i.e., exclude the default Header and Footer)
  const minimalLayoutPaths = ['/confirmation', '/payment', '/subscription'];
  // Example: exclude for /admin/* routes as well
  const isMinimalLayout = minimalLayoutPaths.some(p => pathname === p) || pathname.startsWith('/admin/');

  if (isMinimalLayout) {
    // For these paths, render only the children and SessionProvider (if needed globally)
    // The page itself (e.g., app/login/page.tsx) will define its own full structure.
    return (
      <html lang="en">
        <head>
          <title>Code Mage - Checkout</title> {/* Or use metadata API in the page */}
          <meta
            name="Checkout for Code Mage"
            content="Specific description for this section."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" /> {/* Corrected path for favicon */}
        </head>
        <body className="parallax-background minimal-body"> {/* Optional: different body class */}
          <SessionProvider> {/* SessionProvider might still be needed globally */}
            {children}
          </SessionProvider>
        </body>
      </html>
    );
  }

  // Default layout for all other pages
  return (
    <html lang="en">
      <head>
        <title>Code Mage - Web Development Service</title>
        <meta
          name="description"
          content="Book web development services and explore website builds"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> {/* Corrected path for favicon */}
      </head>
      <body className="parallax-background default-body">
        <SessionProvider>
          <Header />
          <main className="bg-transparent min-h-[600px]">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}