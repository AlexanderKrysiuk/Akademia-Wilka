import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/header";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-providet";
import { Toaster } from "@/components/ui/toaster"



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
        <body className={inter.className}>
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
        </body>
      </html>
    </SessionProvider>
  );
}
