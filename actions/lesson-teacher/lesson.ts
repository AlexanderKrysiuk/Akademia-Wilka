"use server"

import * as ftp from "basic-ftp"
import { prisma } from "@/lib/prisma"
import { CreateLessonSchema } from "@/schemas/lesson"
import { z } from "zod"
import { Lesson, ProductStatus, ProductType } from "@prisma/client"

export const CreateLesson = async (fields: z.infer<typeof CreateLessonSchema>, courseId:string) => {
    
    const lastLesson = await prisma.lesson.findFirst({
        where: { courseId: courseId },
        orderBy: {order: "desc"}
    })

    const newOrder = lastLesson ? lastLesson.order+1 : 0
    
    const newLesson = await prisma.lesson.create({
        data: {
            courseId: courseId,
            title: fields.title,
            type: fields.lessonType,
            order: newOrder
        }
    })

    // Pobieramy użytkowników, którzy mają dostęp do kursu (na podstawie lesson.courseId)
    const usersWithAccess = await prisma.purchasedProducts.findMany({
        where: {
            productId: courseId,
            productType: ProductType.Course,
            status: ProductStatus.Used,
        },
        select: { userId: true },
    });

    // Filtrowanie rekordów, które mają przypisany userId
    const validUsersWithAccess = usersWithAccess.filter(user => user.userId);

    // Tworzymy progres dla każdego użytkownika, który ma przypisane userId
    const progressEntries = validUsersWithAccess.map((user) => ({
        userId: user.userId!,
        lessonId: newLesson.id,
        completed: false, // Początkowo nieukończony
    }));

    if (progressEntries.length > 0) {
        await prisma.userCourseProgress.createMany({ data: progressEntries });
        console.log(`Progres został utworzony dla ${progressEntries.length} użytkowników.`);
    } else {
        console.log('Brak użytkowników z przypisanym userId, progres nie został utworzony.');
    }

    console.log(`Lekcja o ID ${newLesson.id} została opublikowana.`);
    return newLesson
}

export const GetLessonsByCourseId = async (courseId:string) => {
    return await prisma.lesson.findMany({
        where: {courseId: courseId},
        orderBy: {order: "asc"}
    })
}

export const GetLessonById = async (lessonId:string) => {
    return await prisma.lesson.findUnique({
        where: {id: lessonId},
    })
}

export const reOrderLessons = async (data: { id:string, position:number}[]) => {
    const updatePromises = data.map(async({id,position})=>{
        return await prisma.lesson.update({
            where: {id},
            data: { order: position}
        })
    })
    await Promise.all(updatePromises)
}

export const ReorderLessonsByCourseId = async (courseId:string) => {
    const lessons = await GetLessonsByCourseId(courseId)

    for (let i = 0 ; i < lessons.length ; i++ ) {
        await prisma.lesson.update({
            where: { id: lessons[i].id },
            data: { order: i}
        })
    }
}

export const DeleteLessonById = async (lesson:Lesson) => {
    
    const dirPath = `/lessons/${lesson.id}`

    const client = new ftp.Client()
    client.ftp.verbose = true

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false
        })

        const list = await client.list(`/lessons/${lesson.id}`);
        console.log("Root directory contents:", list);
        
        // Sprawdzanie czy folder istnieje
        const folderExist = await client.list(dirPath).catch(() => null)
        if (folderExist) {
            console.log(`Folder istnieje: ${dirPath}`)
  
            // Lista plików w folderze przed usunięciem
            const files = await client.list(dirPath)
            console.log(`Pliki w folderze: ${files.map(file => file.name).join(', ')}`)
  
            // Usuwanie plików z folderu
            for (const file of files) {
                await client.remove(`${dirPath}/${file.name}`)
                console.log(`Usunięto plik: ${file.name}`)
            }
  
            // Usuwanie folderu
            await client.removeDir(dirPath)
            console.log(`Usunięto folder: ${dirPath}`)
        } else {
            console.log(`Folder nie istnieje: ${dirPath}`)
        }
    } catch (error) {
        console.error("Błąd podczas usuwania plików z FTP:", error)
    } finally {
        client.close()
    }

    //Usuwanie rekordu w bazie danych
    try {
        await prisma.lesson.delete({
            where: { id: lesson.id }
        })
        await prisma.userCourseProgress.deleteMany({
            where: { lessonId: lesson.id }
        });
         
        await ReorderLessonsByCourseId(lesson.courseId)
        console.log(`Lekcja o ID ${lesson.id} została usunięta z bazy danych.`)
    } catch (error) {
        console.error("Błąd podczas usuwania lekcji z bazy danych:", error)
    }

    return
}

export async function unpublishLesson (lessonId:string) {
    await prisma.lesson.update({
        where: {id: lessonId},
        data: {published: false}
    })

    await prisma.userCourseProgress.deleteMany({
        where: {lessonId: lessonId}
    })
}

export async function publishLesson (lessonId:string) {
    await prisma.lesson.update({
        where: {id: lessonId},
        data: {published: true}
    })
}

export async function changeLessonPublicity (lesson: Lesson) {
    return await prisma.lesson.update({
        where: {id: lesson.id},
        data: {published: !lesson.published}
    })
}

export const checkLessonPublicationStatus = (lesson: any) => {
    // Sprawdzamy, czy lekcja jest opublikowana
    return lesson.published;
};