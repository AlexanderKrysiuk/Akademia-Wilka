// types.d.ts lub inny plik typów

import { UserRole } from "@prisma/client";

export interface ExtendedUser extends User {
    roles: { role: UserRole }[];
}
