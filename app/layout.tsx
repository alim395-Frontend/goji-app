import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { RoarIconProvider } from '@/context/RoarIconContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Godzilla Movie Catalogue",
  description: "Created on next.js",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <RoarIconProvider>
        {children}
      </RoarIconProvider>
      </body>
      </html>
  );
}