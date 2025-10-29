'use client';

import './globals.css';
import Header from '@/components/header';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideHeaderPaths = ['/'];

  return (
    <html lang="ko">
      <body>
        {!hideHeaderPaths.includes(pathname) && <Header />}
        {children}
      </body>
    </html>
  );
}
