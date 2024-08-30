// utils/permissions.ts
import { ExtendedUser } from "@/types/user";
import { User, UserRole } from "@prisma/client";

// Ogólna funkcja do sprawdzania, czy użytkownik ma odpowiednią rolę
export const hasPermission = (user: ExtendedUser | null, requiredRoles: UserRole[]): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some(role => requiredRoles.includes(role.role));
};

// Specyficzna funkcja do sprawdzania, czy użytkownik jest nauczycielem lub administratorem
export const isTeacher = (user: ExtendedUser | null): boolean => {
    return hasPermission(user, [UserRole.Teacher, UserRole.ADMIN]);
};
