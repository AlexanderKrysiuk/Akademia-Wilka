import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, UserRole } from "@prisma/client";
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if ( token.sub && session.user) {
        session.user.id = token.sub
      }
      if ( token.role && session.user) {
        session.user.role = token.role as UserRole
      }
      //console.log ("SESSION: ", session )
      return session
    },

    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token;

      if (existingUser.role) {
        token.role = { teacher: existingUser.role.teacher };
      }
      //console.log("TOKEN: ", token)
      return token
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig
});
