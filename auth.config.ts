import credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export default {
    providers: [credentials]
} satisfies NextAuthConfig

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