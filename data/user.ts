import { prisma } from "@/lib/prisma";
import { UserRoleAssignment, UserRole } from "@prisma/client";

// Funkcja do pobierania użytkownika na podstawie emaila
export const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
        include: {
            roles: true
        }
    });
};

// Funkcja do pobierania użytkownika na podstawie ID
export const getUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id },
        include: {
            roles: true
        }
    });
};

// Funkcja do pobierania ról użytkownika na podstawie ID
export const getUserRolesByUserID = async (id: string) => {
    return await prisma.userRoleAssignment.findMany({
        where: { userId: id },
    });
};




{/*
import { prisma } from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {email},
    })
    return user
}

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
    })
    return user
}

export const getUserRolesByUserID = async (id: string) => {
    const roles = await prisma.userRoleAssignment.findMany({
        where: { userId: id },
        select: { role: true } 
    })
    return roles
}
*/}