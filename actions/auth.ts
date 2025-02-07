"use server"
import { RegisterSchema } from "@/schema/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function registerNewUser(data: z.infer<typeof RegisterSchema>) {
    try {
        const { email } = data
        const existingUser = await prisma.user.findUnique({ 
            where: { email }})
    
        if (existingUser) return { error: { message: "Ten e-mail jest już zajęty", field: "email" }}
    
        await prisma.user.create({ data })
    } catch(error) {
        console.error(error)
        return { error: { message: "Wystąpił nieznany błąd", field: "root" }}
    }

    return {}
}
