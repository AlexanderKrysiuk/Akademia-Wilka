"use server"

import { generatePasswordResetToken, getPasswordResetTokenByToken } from "@/data/token"
import { NewPasswordSchema } from "@/schemas/user"
import * as z from 'zod'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from "@/data/user"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/nodemailer"

export async function checkPasswordResetToken(token:string) {
    const existingToken = await getPasswordResetTokenByToken(token)

    if (!existingToken) {
        throw new Error("Nie znaleziono tokenu!") 
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        const passwordResetToken = await generatePasswordResetToken(existingToken.email.toLowerCase())
        await sendPasswordResetEmail(
            passwordResetToken.email.toLowerCase(),
            passwordResetToken.token
        )
        throw new Error("Token stracił ważność! wysłano nowy");
    }

    return existingToken.email.toLowerCase();
}

export async function setAnotherPassword(data: z.infer<typeof NewPasswordSchema>, token: string) {
    if (!token) {
        throw new Error("Nie podano tokenu!")
    }

    const exisitngToken = await getPasswordResetTokenByToken(token)

    if (!exisitngToken) {
        throw new Error("Nie znaleziono tokenu!")
    }

    const hasExpired = new Date(exisitngToken.expires) < new Date();

    if (hasExpired) {
        const passwordResetToken = await generatePasswordResetToken(exisitngToken.email.toLowerCase())
        await sendPasswordResetEmail(
            passwordResetToken.email.toLowerCase(),
            passwordResetToken.token
        )
        throw new Error("Token stracił ważność! wysłano nowy");
    }

    const existingUser = await getUserByEmail(exisitngToken.email.toLowerCase())

    if (!existingUser){
        throw new Error("Nie znaleziono użytkownika")
    }

    const hashedPassword = await bcrypt.hash(data.password, 11)

    await prisma.user.update({
        where: { id: existingUser.id },
        data: {
            password: hashedPassword
        }  
    })
    
    await prisma.passwordResetToken.delete({
        where: { id: exisitngToken.id }
    })

}


{/*
export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null
) => {
    if (!token) {
        return { success: false, message: "Brak tokenu!"}
    }

    const validatedFields = NewPasswordSchema.safeParse(values)

    if (!validatedFields.success) {
        return { success: false, message: "Podano nieprawidłowe pola!" }
    }

    const exisitngToken = await getPasswordResetTokenByToken(token)

    if (!exisitngToken) {
        return { success: false, message: "Podano nieprawiłowy token!" }
    }

    const existingUser = await getUserByEmail(exisitngToken.email)

    if (!existingUser) {
        return { success: false, message: "Podany email nie istnieje!"}
    }

    const hasExpired = new Date(exisitngToken.expires) < new Date()

    if (hasExpired) {
        return { success: false, message: "Token stracił ważność!" }
    }

    const password = validatedFields.data.password
    const hashedPassword = await bcrypt.hash(password, 11);
    
    await prisma.user.update({
        where: { ID: existingUser.ID },
        data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.delete({
        where: { ID: exisitngToken.ID }
    })

    return { success: true, message: "Hasło zaktualizowane!" }
}
*/}