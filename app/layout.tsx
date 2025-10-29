"use client";

import "./globals.css";
import Header from "@/components/Header";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
          <Header/>
          {children}
      </body>
    </html>
  );
}
