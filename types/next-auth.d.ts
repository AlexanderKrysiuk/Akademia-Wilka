// types/next-auth.d.ts
import { User as PrismaUser, UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User extends PrismaUser {}

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: UserRole | null; // Zależy od struktury Twojego UserRole
      image?: string | null;
      // Dodaj tutaj dodatkowe pola, które chcesz mieć w sesji
    };
  }

  interface JWT {
    id: string;
    email: string;
    role?: UserRole | null;
    // Dodaj tutaj dodatkowe pola, które chcesz mieć w JWT
  }
}
