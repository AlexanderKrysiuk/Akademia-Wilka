"use server"
import { getUserById } from "@/data/user"
import { prisma } from "@/lib/prisma"
import { CreateLessonSchema } from "@/schemas/lesson"
import * as z from 'zod'
import { getChapterByID } from "./chapter"
import { getCourseById } from "./get"
import { v4 as uuidv4 } from "uuid";
import { LessonType, VideoSource } from "@prisma/client"
import { uploadVideoLessonToServer } from "../file/video"

export const getLessonsByChapterID = async (id:string) => {
    const lessons = await prisma.lesson.findMany({
        where: { chapterId: id}
    })
    return lessons
}

export const getLessonByID = async (id: string) => {
    const lesson = await prisma.lesson.findUnique({
        where: {id}
    })
    return lesson
}

export const createLesson = async (values: z.infer<typeof CreateLessonSchema>, userID: string, chapterID: string) => {
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

    const lessonType = validatedFields.data.lessonType

    if (!lessonType) {
        return { success: false, message: "Nie podano rodzaju lekcji!" }
    }

    const lessonID = uuidv4()

    {/*
    let videoUrl: string | undefined
    
    if (lessonType === LessonType.Video) {
        //const videoSource = validatedFields.data.videoSource

        //if (!videoSource) {
        //    return { success: false , message: "Podany film nie ma źródła!" }
        //}
        if (videoSource === VideoSource.internal) {
            const videoFile = validatedFields.data.videoFile

            if (!videoFile) {
                return { success: false, message: "Nie znaleziono filmu do przesłania!" }
            }

            const videoUploadResponse = await uploadVideoLessonToServer(videoFile, existingUser.id, existingChapter.id, lessonID)
            
            if (!videoUploadResponse?.dataPath){
                return { success: videoUploadResponse?.success, message: videoUploadResponse?.message}
            }

            videoUrl = videoUploadResponse.dataPath

        } else {
            videoUrl = validatedFields.data.videoUrl   
        }
    }
    */}

    //const content = validatedFields.data.content;

    const highestOrderLesson = await getHighestOrderLessonByChapterID(chapterID)
    const newOrder = highestOrderLesson ? highestOrderLesson.order + 1 : 0

    await prisma.lesson.create({
        data: {
            id: lessonID,
            title: title,
            chapterId: existingChapter.id,
            order: newOrder,
            type: lessonType,
            //content: lessonType === LessonType.Subchapter ? undefined : content, // Tylko dla lekcji, nie dla subrozdziałów
            //videoUrl: videoUrl, // URL wideo, jeśli przesłano
        }
    })

    if (lessonType === LessonType.Subchapter) {
        return { success: true, message: "Utworzono nowy podrozdział!" }
    }
    return { success: true, message: "Utworzono nowa lekcję!", }
}

export const getHighestOrderLessonByChapterID = async (id: string) => {
    const highestOrderLesson = await prisma.lesson.findFirst({
        where: { chapterId: id},
        orderBy: { order: 'desc'}
    })
    return highestOrderLesson
}

export const reOrderLessons = async (Data: { id: string, position: number}[], userID:string, chapterID:string) => {
    const existingUser = await getUserById(userID)

    if (!existingUser) {
        return { success: false, message: "Nie znaleziono użytkownika!" }
    }

    if (!existingUser?.role?.teacher) {
        return { success: false, message: "Nie masz uprawnień do usunięcia tego rozdziału!" }
    }

    const existingChapter = await getChapterByID(chapterID)

    if (!existingChapter) {
        return { success: false, message: "Nie znaleziono rozdziału!" }
    }

    const existingCourse = await getCourseById(existingChapter.courseId)

    if (!existingCourse) {
        return { success: false, message: "Nie znaleziono kursu!" }
    }

    if (existingCourse.ownerId !== existingUser.id) {
        return { success: false, message: "Nie jesteś właścicielem tego kursu!" }
    }

    if (!Data) {
        return { success: false, message: "Nie wykrto listy do zaktualizowania!" }
    }

    const updatePromises = Data.map(async ({ id, position }) => {
        return await prisma.lesson.update({
            where: { id },
            data: { order: position }
        });
    });

    await Promise.all(updatePromises)

    return { success: true, message: "Kolejność lekcji została zaktualizowana!" }

}

export const deleteLessonByID = async (lessonID: string, userID: string) => {
    const existingLesson = await getLessonByID(lessonID)

    if (!existingLesson) {
        return { success: false, message: "Nie znaleziono lekcji!" }
    }

    const existingChapter = await getChapterByID(existingLesson.chapterId)

    if (!existingChapter) {
        return { success: false, message: "Nie znaleziono rodziału!" }
    }

    const existingCourse = await getCourseById(existingChapter.courseId)

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

    if (existingChapter.id !== existingLesson.chapterId) {
        return { success: false, message: "Ta lekcja nie należy do tego rozdziału!"}
    }

    const deletedLesson = await prisma.lesson.delete({
        where: { id: existingLesson.id }
    })

    await prisma.lesson.updateMany({
        where: {
          chapterId: existingChapter.id,
          order: { gt: deletedLesson.order },  // Znajdź rozdziały o wyższej wartości order
        },
        data: {
          order: {
            decrement: 1,  // Zmniejsz wartość order o 1
          },
        },
      });

    return { success: true, message: "Pomyślnie usunięto lekcję!" }
}