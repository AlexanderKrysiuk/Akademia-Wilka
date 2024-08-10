"use server"
import { prisma } from "@/lib/prisma"

export const getCourseById = async (id: string) => {
    try {
        const course = await prisma.course.findUnique({
            where: {id},
        })
        return course
    } catch {
        return
    }
}