"use server"
import { prisma } from "@/lib/prisma"

export const getCourseById = async (id: string) => {
    return await prisma.course.findUnique({
        where: {id},
    })       
}