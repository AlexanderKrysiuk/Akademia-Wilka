"use server"
import { prisma } from "@/lib/prisma"

export const findPurchase = async (courseId:string, userId:string) => {
    return await prisma.purchase.findUnique({
        where: {
            userId_courseId: {
                userId: userId,
                courseId: courseId
            }
        }
    })
}