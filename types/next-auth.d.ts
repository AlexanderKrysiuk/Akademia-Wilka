// src/types/next-auth.d.ts

import { UserRole } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      role: string[]
    }
  }
}

{/* 
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      customfield: string
    }
  }

  interface JWT extends DefaultJWT {
    customfield: string
  }
}

*/}

{/* 
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession
  }
}
*/}

{/* 
import { UserRole } from "@prisma/client";



declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string[]; // Rolę przechowujemy jako enum UserRole
    } & DefaultSession["user"];
  }
  
  interface JWT {
    id: string;
    role: UserRole[];
  }
}

*/}