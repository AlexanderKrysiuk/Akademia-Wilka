import prisma from "@/lib/prisma";
import { useSession } from "next-auth/react";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {email}
        })
        return user
    } catch(error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
}