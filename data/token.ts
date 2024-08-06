import prisma from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getVerificationTokenByEmail(email)

    if(existingToken) {
        await prisma.verificationToken.delete({
            where: { id: existingToken.id }
        })
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email: email,
            token: token,
            expires: expires,
        }
    })
    return verificationToken
}

export const getVerificationTokenByEmail = async ( email: string ) => {
    try {
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {email}
        })
        return verificationToken
    } catch (error) {
        console.error("Error fetching token by email", error)
        return null
    }
}

export const getVerificationTokenByToken = async ( token: string ) => {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token }
        })
        return verificationToken
    } catch (error) {
        console.error("Error fetching token by token", error)
        return null
    }
}