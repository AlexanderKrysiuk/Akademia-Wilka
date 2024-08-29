"use server"

import { prisma } from "@/lib/prisma"

export const getMyCourses = async (id: string) => {
    return prisma.course.findMany({
        where: { ownerId: id },
    })
}

export const getAllPublishedCourses = async () => {
    try {
        return await prisma.course.findMany({
            where: {
                isPublished: true
            },
            include: {
                chapters: {
                    where: {
                        published: true
                    }
                }
            }
        })
        
    } catch (error) {
        return [];
    }

}