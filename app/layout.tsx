'use client';

import './globals.css';
import Header from '@/components/Header';
import TestHeader from '@/components/TestHeader';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideHeaderPaths = ['/'];

  const testHeaderPaths = ['/survey', '/cat'];
  const isTestPath = testHeaderPaths.some(path => pathname?.startsWith(path));

  return (
    <html lang="ko">
      <body>
        {isTestPath ? <TestHeader /> : !hideHeaderPaths.includes(pathname || '') && <Header />}
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#FFFFFF',
              color: '#000000',
              borderLeft: '4px solid #4A8AEE',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          }}
        />
      </body>
    </html>
  );
}
