import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail, getUserRolesByUserID } from "./data/user";
import { compare } from "bcryptjs";
import { sendNewVerificationEmail } from "./actions/auth/new-verification";
import { generateVerificationToken } from "./data/token";
import { sendVerificationEmail } from "./lib/nodemailer";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config";


export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string
        const password = credentials.password as string
        
        if (!email || !password) {
          throw new Error ("Proszę podać e-mail i hasło!")
        }
        
        const user = await getUserByEmail(email)
        
        if (!user || !user.email || !user.password) {
          throw new Error("Nie znaleziono użytkownika!")
        }
        
        if (!user.emailVerified) {
          throw new Error("Konto nie zostało zweryfikowane!")
        }
        
        const matched = await compare(password, user.password)

        if (!matched){
          throw new Error("Podane hasło jest nieprawidłowe!")
        }

        {/*
        if (!(await compare(password, user.password))) {
          throw new Error("Podane hasło jest nieprawidłowe!")
        }
        */}
        return user
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (token.sub) {
        token.role = await getUserRolesByUserID(token.sub)
        //console.log("token.role", token.role)
      }    
      return token
    },
    async session({ token, session }){
      if (token.sub) {
        session.user.id = token.sub
      }
      if (token.role) {
        session.user.role = token.role as string[]
      }
    return session
  }
  }
}) 



{/*
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail, getUserRolesByUserID } from "./data/user";
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
        const email = credentials?.email;
        const password = credentials?.password;

        
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
          return {
            id: user.id,
            email: user.email,
            image: user.image,
          };
        } else {
          // Jeżeli hasła nie pasują, zwróć null
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/start"
  },
  callbacks: {    
    async jwt({ token, user }) {
      if (user) {
        if (user.id) {
          const roles = await getUserRolesByUserID(user.id)
          token.id = user.id;
          token.roles = roles.map(role => role.role);
          token.image = user.image
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        // Sprawdzamy, czy token.ID jest zdefiniowany
        if (token.id) {
          session.user.id = token.id;
        }
        session.user.roles = token.roles || [];
        session.user.image = token.image
      }
      return session;
    },
  }
});
*/}
{/* 
// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

// Inicjalizacja klienta Prisma
const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        
        if (!email || !password) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email },
          include: { roles: true }, // Pobieranie ról użytkownika
        });
        
        if (!user || !user.password) {
          return null;
        }
        
        const passwordsMatch = await bcrypt.compare(password, user.password);
        
        if (passwordsMatch) {
          return { ID: user.ID, email: user.email, roles: user.roles.map(role => role.role) };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Dodaj role z tokena do sesji
      if (token.roles) {
        session.user.roles = token.roles;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Dodaj role z użytkownika do tokena
        token.roles = (user as any).roles || [];
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
*/}




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