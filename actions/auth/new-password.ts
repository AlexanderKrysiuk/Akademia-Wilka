"use server"

import { getPasswordResetTokenByToken } from "@/data/token"
import { NewPasswordSchema } from "@/schemas/user"
import * as z from 'zod'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from "@/data/user"
import prisma from "@/lib/prisma"

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
        where: { id: existingUser.id },
        data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.delete({
        where: { id: exisitngToken.id }
    })

    return { success: true, message: "Hasło zaktualizowane!" }
}