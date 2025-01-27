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
import { HeroUIProvider } from "@heroui/system";
import "react-image-crop/dist/ReactCrop.css";
import { CartProvider } from "@/components/cart/cart";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Akademia Wilka",
  description: "Edukacja On-line",
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
        <body className="max-h-full">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <main className="w-full h-full">
                <Header/>
                <Toaster/>
                {children}
                    
              </main>
            </CartProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
