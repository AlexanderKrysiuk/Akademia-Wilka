"use server"
import { prisma } from "@/lib/prisma"

export const getLessonsByChapterID = async (id:string) => {
    const lessons = await prisma.lesson.findMany({
        where: { chapterId: id}
    })
    return lessons
}