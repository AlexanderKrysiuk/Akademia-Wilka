"use server"

import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function AdminGate(userId:string) {
    return await prisma.userRoleAssignment.findFirst({
        where: {
            userId: userId,
            role: UserRole.Admin
        }
    })
}