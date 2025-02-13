"use server"
import { NewPasswordSchema, RegisterSchema, ResetPasswordSchema } from "@/schema/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/nodemailer"
import { VerificationToken } from "@prisma/client"
import bcrypt from "bcryptjs"

export async function registerNewUser(data: z.infer<typeof RegisterSchema>) {
    try {
        const { email } = data
        const existingUser = await prisma.user.findUnique({ 
            where: { email }})
    
        if (existingUser) return { error: { message: "Ten e-mail jest już zajęty", field: "email" }}
    
        await prisma.user.create({ data })

        const verificationToken = await generateVerificationToken(email)
        await sendVerificationEmail(verificationToken)
        return {}

    } catch(error) {
        console.error("[registerNewUser]:", error)
        return { error: { message: "Wystąpił nieznany błąd", field: "root" }}
    }
}

export const setNewPassword = async (data: z.infer<typeof NewPasswordSchema>, token: VerificationToken) => {
    try {
        const deletedToken = await prisma.verificationToken.delete({
            where: { id: token.id }
        })

        if (!deletedToken) return { error: { message: "Podano nieprawidłowy token", field: "root" } }

        const hashedPassword = await bcrypt.hash(data.newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS!))

        await prisma.user.update({
            where: { email: token.email },
            data: { 
                password: hashedPassword,
                emailVerified: new Date()
            }
        })
        return {}
    } catch (error) {
        console.error("[setNewPassword]:", error)
        return { error: { message: "Wystąpił nieznany błąd", field: "root" }}
    }
}

export const ResetPassword = async (data: z.infer<typeof ResetPasswordSchema>) => {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (!existingUser) return { success: "Jeśli konto istnieje, wysłaliśmy e-mail z linkiem resetującym." };

        await prisma.verificationToken.deleteMany({
            where: {email: data.email}
        })

        const verificationToken = await generateVerificationToken(data.email)
        await sendPasswordResetEmail(verificationToken)
        return { success: "Jeśli konto istnieje, wysłaliśmy e-mail z linkiem resetującym." }; 
    } catch (error) {
        console.error("[ResetPassword]:", error)
        return { error: { message: "Wystąpił nieznany błąd", field: "root" }}
    }
}

export async function generateVerificationToken (email: string){
    const expires = new Date(new Date().getTime() + 3600 * 1000)
    return await prisma.verificationToken.create({
        data: { email, expires }
    })
}

export async function verifyPassword (password:string, hashedPassword:string) {
    return await bcrypt.compare(password, hashedPassword)
}