// @types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: {
      teacher: boolean;
    };
  }

  interface Session {
    user: User;
  }

}
