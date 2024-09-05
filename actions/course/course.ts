"use server"

import { getUserById } from "@/data/user"
import { isTeacher } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { EditSlugSchema } from "@/schemas/course"
import * as z from 'zod'
import { getCourseById } from "./get"

/* VALIDATION */
const validatePermisions = async (userID:string, courseID: string) => {
    const user = await getUserById(userID)
    if (!user) {
        throw Error("Podany użytkownik nie istnieje!")
    }

    if (!isTeacher(user)) {
        throw Error("Nie masz uprawnień do edycji tego kursu!")
    }

    const course = await getCourseById(courseID)

    if (!course){
        throw Error("Podany kurs nie istnieje!")
    }

    if (course.ownerId !== userID){
        throw Error("Nie masz uprawnień do edycji tego kursu!")
    }
}


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



/* SLUG */
export const getCourseBySlug = async (slug:string) => {
    return prisma.course.findUnique({
        where: { slug: slug }
    })
}

export const updateCourseSlug = async (values: z.infer<typeof EditSlugSchema>, userID: string, courseID: string) => {
    const validatedFields = EditSlugSchema.safeParse(values)

    if (!validatedFields.success){
        throw Error("Podano nieprawidłowe pola!")
    }

    validatePermisions(userID, courseID)

    const slug = validatedFields.data.slug

    if (!slug) {
        throw Error("Nie znaleziono unikalnego odnośnika!")
    }

    await prisma.course.update({
        where: {id: courseID},
        data: {slug: slug}
    })
}