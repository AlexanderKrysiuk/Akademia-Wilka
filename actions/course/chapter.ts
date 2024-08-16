"use server"
import { getUserById } from "@/data/user"
import { prisma } from "@/lib/prisma"
import { CreateChapterSchema, EditChapterSchema } from "@/schemas/chapter"
import * as z from 'zod'
import { getCourseById } from "./get"
import { v4 as uuidv4 } from "uuid";

export const getChaptersByCourseID = async (id: string) => {
    const chapters = await prisma.chapter.findMany({
        where: { courseId: id}
    })
    return chapters
}

export const getChapterByID = async (id: string) => {
    const chapter = await prisma.chapter.findUnique({
        where: { id }
    })
    return chapter
}

export const createChapter = async (values: z.infer<typeof CreateChapterSchema>, courseID: string, userID: string) => {
    const validatedFields = CreateChapterSchema.safeParse(values)

    if (!validatedFields.success){
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

    const existingCourse = await getCourseById(courseID)
    
    if (!existingCourse) {
        return { success: false, message: "Nie znaleziono kursu!" }
    }
    
    if (existingCourse.ownerId !== existingUser.id) {
        return { success: false, message: "Nie jesteś właścicielem tego kursu!" }
    }
    
    const title = validatedFields.data.title
    
    if (!title) {
        return { success: false, message: "Nie podano tytułu rozdziału!" }
    }

    const chapterID = uuidv4()

    await prisma.chapter.create({
        data: {
            id: chapterID,
            title: title,
            courseId: existingCourse.id
        }
    })

    return { success: true, message: "Utworzono nowy rozdział!"}
}

export const deleteChapterByID = async (chapterID: string, userID: string, courseID: string) => {
    const existingChapter = await getChapterByID(chapterID)

    if (!existingChapter) {
        return { success: false, message: "Nie znaleziono rodziału!" }
    }

    const existingCourse = await getCourseById(courseID)

    if (!existingCourse) {
        return { success: false, message: "Nie znaleziono kursu!" }
    }

    const existingUser = await getUserById(userID)

    if (!existingUser) {
        return { success: false, message: "Nie znaleziono użytkownika!" }
    }

    if (!existingUser?.role?.teacher) {
        return { success: false, message: "Nie masz uprawnień do usunięcia tego rozdziału!" }
    }

    if (existingCourse.ownerId !== existingUser.id) {
        return { success: false, message: "Nie jesteś właścicielem tego kursu!" }
    }

    if (existingCourse.id !== existingChapter.courseId) {
        return { success: false, message: "Ten rozdział nie należy do tego kursu!"}
    }

    await prisma.chapter.delete({
        where: { id: existingChapter.id }
    })

    return { success: true, message: "Pomyślnie usunięto rozdział!" }
}

export const updateChapterByID = async (values: z.infer<typeof EditChapterSchema>, chapterID: string, userID: string, courseID: string) => {
    const validatedFields = CreateChapterSchema.safeParse(values)

    if (!validatedFields.success){
        return { success: false, message: "Podane pola są nieprawidłowe!" }
    }

    const existingChapter = await getChapterByID(chapterID)

    if (!existingChapter) {
        return { success: false, message: "Nie znaleziono rodziału!" }
    }

    const existingCourse = await getCourseById(courseID)

    if (!existingCourse) {
        return { success: false, message: "Nie znaleziono kursu!" }
    }

    const existingUser = await getUserById(userID)

    if (!existingUser) {
        return { success: false, message: "Nie znaleziono użytkownika!" }
    }

    if (!existingUser?.role?.teacher) {
        return { success: false, message: "Nie masz uprawnień do usunięcia tego rozdziału!" }
    }

    if (existingCourse.ownerId !== existingUser.id) {
        return { success: false, message: "Nie jesteś właścicielem tego kursu!" }
    }

    if (existingCourse.id !== existingChapter.courseId) {
        return { success: false, message: "Ten rozdział nie należy do tego kursu!"}
    }

    const title = validatedFields.data.title
    
    if (!title) {
        return { success: false, message: "Nie podano tytułu rozdziału!" }
    }

    await prisma.chapter.update({
        where: { id: existingChapter.id },
        data: {
            title: title
        }
    })

    return { success: true, message: "Pomyślnie zmieniono tytuł rozdziału!" }
}