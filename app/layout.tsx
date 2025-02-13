import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import RootWrapper from "@/components/root-wrapper";
import Toaster from "@/components/toaster";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

//const geistSans = Geist({
//  variable: "--font-geist-sans",
//  subsets: ["latin"],
//});

//const geistMono = Geist_Mono({
//  variable: "--font-geist-mono",
//  subsets: ["latin"],
//});

export const metadata: Metadata = {
  title: "Akademia Wilka",
  description: "Twój przewodnik do zdanych egzaminów",
  icons: {
    icon: "/akademia-wilka-sygnet.svg"
  }
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
        <RootWrapper>
          <body>
            <main>
              <Header/>
              {children}
              <Toaster/>
            </main>
          </body>
        </RootWrapper>
      </html>
    </SessionProvider>
  );
}
