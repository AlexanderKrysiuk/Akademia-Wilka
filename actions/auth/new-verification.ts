"use server"

import { getVerificationTokenByToken } from "@/data/token"
import { getUserByEmail } from "@/data/user"
import { prisma } from "@/lib/prisma"

export const NewVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token)

    if (!existingToken) {
        return { success: false, message: "Podany Token nie istnieje!" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired){
        return { success: false, message: "Token stracił ważność!" }
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if (!existingUser){
        return { success: false, message: "Podany e-mail nie istnieje!" }
    }

    await prisma.user.update({
        where: { ID: existingUser.ID },
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    })

    await prisma.verificationToken.delete({
        where: { ID: existingToken.ID}
    })

    return { success: true, message: "Email zweryfikowany!"}
}