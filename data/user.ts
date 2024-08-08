import prisma from "@/lib/prisma";

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

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                roles: true
            }
        })
        return user
    } catch {
        return null
    }
}