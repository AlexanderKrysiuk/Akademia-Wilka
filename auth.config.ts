import { NextAuthConfig } from "next-auth";
import { getUserRolesByUserID } from "./data/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma"

export const authConfig = {
    pages: { signIn: "/auth/start" },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [],
    callbacks: {
        async session({ token, session,  }){
            if (token.role) {
                session.user.role = token.role as string[]
            }
          return session
        }
      },
} satisfies NextAuthConfig

{/* 
import credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export default {
    providers: [credentials]
} satisfies NextAuthConfig
*/}

{/* 
import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

import { LoginSchema } from "@/schemas/user";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);
                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;
                    
                    const user = await getUserByEmail(email);
                    if (!user || !user.password) return null;
                    
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    
                    if (passwordsMatch) return user;
                }
                return null;
            }
        })
    ],
    // Dodaj inne opcje konfiguracji, takie jak session, callbacks, etc.
};

export default authOptions;

*/}