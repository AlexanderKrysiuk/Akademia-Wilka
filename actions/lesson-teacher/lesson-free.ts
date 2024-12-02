"use server"

import { prisma } from "@/lib/prisma"

export async function UpdateLessonFreeStatus(isFree:boolean, lessonId:string) {
    const response =  await prisma.lesson.update({
        where: { id: lessonId },
        data: { free: isFree } 
    })
    return response.free
}