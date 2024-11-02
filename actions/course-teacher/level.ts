"use server"

import { prisma } from "@/lib/prisma"

export async function GetLevels() {
    return await prisma.level.findMany()
}

export async function UpdateLevel(courseId:string, levelId:string) {
    await prisma.course.update({
        where: {id: courseId},
        data: {levelId: levelId}
    })
}