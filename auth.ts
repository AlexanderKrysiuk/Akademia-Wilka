import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, UserRoles } from "@prisma/client";
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if ( token.sub && session.user) {
        session.user.id = token.sub
      }
      if ( token.roles && session.user) {
        session.user.roles = token.roles as UserRoles
      }
      return session
    },

    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token;

      token.roles = {
        student: existingUser.roles.some(role => role.student) || false,
        teacher: existingUser.roles.some(role => role.teacher) || false,
        };
      return token
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig
});
