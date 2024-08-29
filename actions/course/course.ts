"use server"

import { prisma } from "@/lib/prisma"

export const getMyCourses = async (id: string) => {
    return prisma.course.findMany({
        where: { ownerId: id },
    })
}