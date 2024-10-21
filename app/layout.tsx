import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-quill/dist/quill.snow.css';

import Header from "@/components/navbar/header";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import stylów
import { useTheme } from "next-themes";
import Toaster from "@/components/toaster";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${inter.className} h-full`}>
          <main className="h-full">
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Header/>
              {children}
              <Toaster/>
            </ThemeProvider>
          </main>
        </body>
      </html>
    </SessionProvider>
  );
}
