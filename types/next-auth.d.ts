// @types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    roles: {
      student: boolean;
      teacher: boolean;
    };
  }

  interface Session {
    user: User;
  }

}
