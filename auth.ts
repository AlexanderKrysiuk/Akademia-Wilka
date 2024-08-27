import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";

export const BASE_PATH = "/api/auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Bezpieczne rzutowanie typu unknown na string
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          // Jeżeli email lub hasło są niepoprawne, zwróć null
          return null;
        }

        // Pobierz użytkownika na podstawie emaila
        const user = await getUserByEmail(email);

        // Jeżeli użytkownik nie istnieje lub nie ma hasła, zwróć null
        if (!user || !user.password) {
          return null;
        }

        // Porównaj hasło z hasłem zapisanym w bazie
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          // Jeżeli hasła pasują, zwróć użytkownika
          return user;
        } else {
          // Jeżeli hasła nie pasują, zwróć null
          return null;
        }
      },
    }),
  ],
});


{/* 
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, UserRole } from "@prisma/client";
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub; // Przypisanie ID użytkownika
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole; // Przypisanie roli użytkownika
      }
      return session;
    },
    
    async jwt({ token }) {
      if (!token.sub) return token;
      
      const existingUser = await getUserById(token.sub); // Pobieranie użytkownika z bazy danych
      
      if (!existingUser) return token;
      
      // Przypisywanie roli użytkownika do tokenu
      token.role = existingUser.role ? { teacher: existingUser.role.teacher } : undefined;
      
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig
});

*/}