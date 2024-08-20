"use server"
import { getUserById } from "@/data/user"
import { prisma } from "@/lib/prisma"
import { CreateLessonSchema } from "@/schemas/lesson"
import * as z from 'zod'
import { getChapterByID } from "./chapter"
import { getCourseById } from "./get"
import { v4 as uuidv4 } from "uuid";
import { LessonType } from "@prisma/client"

export const getLessonsByChapterID = async (id:string) => {
    const lessons = await prisma.lesson.findMany({
        where: { chapterId: id}
    })
    return lessons
}

export const createLesson = async (values: z.infer<typeof CreateLessonSchema>, userID: string, chapterID: string, lessonType: LessonType) => {
    const validatedFields = CreateLessonSchema.safeParse(values)

    if (!validatedFields.success) {
        return { success: false, message: "Podane pola są nieprawidłowe!" }
    }

    if (!userID) {
        return { success: false, message: "Nie podano właśiciela kursu!"}
    }

    const existingUser = await getUserById(userID)

    if (!existingUser) {
        return { success: false, message: "Nie znaleziono użytkownika!" }
    }

    if (!existingUser?.role?.teacher) {
        return { success: false, message: "Nie masz uprawnień do utworzenia kursu!" }
    }

    const existingChapter = await getChapterByID(chapterID)

    if (!existingChapter) {
        return { success: false, message: "Nie znaleziono rozdziału do którego chcesz przypsiać lekcję!" }
    }

    const existingCourse = await getCourseById(existingChapter.courseId)

    if (!existingCourse) {
        return { success: false, message: "Nie znaleziono kursu do którego chcesz przypisać lekcję!" }
    }

    if (existingCourse.ownerId !== existingUser.id) {
        return { success: false, message: "Nie jesteś właścicielem tego kursu!" }
    }

    const title = validatedFields.data.title

    if (!title) {
        return { success: false, message: "Nie podano tytułu lekcji!" }
    }

    const lessonID = uuidv4()

    const highestOrderLesson = await getHighestOrderLessonByChapterID(chapterID)
    const newOrder = highestOrderLesson ? highestOrderLesson.order + 1 : 1

    await prisma.lesson.create({
        data: {
            id: lessonID,
            title: title,
            chapterId: existingChapter.id,
            order: newOrder,
            type: lessonType
        }
    })

    if (lessonType = LessonType.Subchapter) {
        return { success: true, message: "Utworzono nowy podrozdział!" }
    }
    return { success: true, message: "Utworzono nowa lekcję!" }
}

export const getHighestOrderLessonByChapterID = async (id: string) => {
    const highestOrderLesson = await prisma.lesson.findFirst({
        where: {id: id},
        orderBy: { order: 'desc'}
    })
    return highestOrderLesson
}