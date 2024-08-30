"use server"

import { prisma } from "@/lib/prisma"

export const getMyCourses = async (id: string) => {
    return prisma.course.findMany({
        where: { ownerId: id },
    })
}

export const getAllPublishedCourses = async () => {
    const courses = await prisma.course.findMany({
        where: { published: true },
        include: {
            category: true,
            level: true,
            chapters: {
                where: { published: true },
                include: {
                    lessons: {
                        where: { published: true }
                    }
                }
            }   
        }
    })
    return courses.map(course => ({
        ...course,
        chapterCount: course.chapters.length,
        lessonCount: course.chapters.reduce((count, chapter) => count + chapter.lessons.length, 0)
    }))
}