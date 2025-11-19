'use client';

import './globals.css';
import Header from '@/components/Header';
import TestHeader from '@/components/TestHeader';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

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
      </body>
    </html>
  );
}
