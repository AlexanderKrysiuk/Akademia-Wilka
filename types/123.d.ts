// src/types/next-auth.d.ts
{/* 
import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: UserRole[]; // Rolę przechowujemy jako enum UserRole
    } & DefaultSession["user"];
  }
  
  interface JWT {
    id: string;
    roles: UserRole[];
  }
}
*/}