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
