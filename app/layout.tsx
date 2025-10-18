"use client";

import "./globals.css";
import type { ReactNode } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
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
