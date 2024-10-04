"use server"

import { generateVerificationToken, getVerificationTokenByToken } from "@/data/token"
import { getUserByEmail } from "@/data/user"
import { sendVerificationEmail } from "@/lib/nodemailer"
import { prisma } from "@/lib/prisma"
import { NewPasswordSchema } from "@/schemas/user"
import { z } from "zod"
import bcrypt from 'bcryptjs'

export async function checkVerificationToken(token:string) {
    const existingToken = await getVerificationTokenByToken(token)

    if (!existingToken) {
        throw new Error("Nie znaleziono tokenu!") 
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        const verificationToken = await generateVerificationToken(existingToken.email)
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )
        throw new Error("Token stracił ważność! wysłano nowy");
    }

    return existingToken.email;
}

export async function setFirstPassword(data: z.infer<typeof NewPasswordSchema>, token: string) {
    if (!token) {
        throw new Error("Nie podano tokenu!")
    }
    
    const existingToken = await getVerificationTokenByToken(token)

    if (!existingToken) {
        throw new Error("Nie znaleziono tokenu!")
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        const verificationToken = await generateVerificationToken(existingToken.email)
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )
        throw new Error("Token stracił ważność! wysłano nowy");
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if (!existingUser) {
        throw new Error("Nie znaleziono użytkownika")
    }

    const hashedPassword = await bcrypt.hash(data.password, 11)

    await prisma.user.update({
        where: { id: existingUser.id },
        data: { 
            password: hashedPassword, 
            emailVerified: new Date()
        }
    })

    await prisma.verificationToken.delete({
        where: { id: existingToken.id }
    })
}




{/* 
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
*/}