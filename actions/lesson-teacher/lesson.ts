"use server"

import * as ftp from "basic-ftp"
import { prisma } from "@/lib/prisma"
import { CreateLessonSchema } from "@/schemas/lesson"
import { z } from "zod"

export const CreateLesson = async (fields: z.infer<typeof CreateLessonSchema>, chapterId:string) => {
    
    const lastLesson = await prisma.lesson.findFirst({
        where: { chapterId: chapterId },
        orderBy: {order: "desc"}
    })

    const newOrder = lastLesson ? lastLesson.order+1 : 0
    
    return await prisma.lesson.create({
        data: {
            chapterId: chapterId,
            title: fields.title,
            type: fields.lessonType,
            order: newOrder
        }
    })
}

export const GetLessonsByChapterId = async (chapterId:string) => {
    return await prisma.lesson.findMany({
        where: {chapterId: chapterId},
        orderBy: {order: "asc"}
    })
}

export const GetLessonById = async (lessonId:string) => {
    return await prisma.lesson.findUnique({
        where: {id: lessonId}
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

export const ReorderLessonsByChapterId = async (chapterId:string) => {
    const lessons = await GetLessonsByChapterId(chapterId)

    for (let i = 0 ; i < lessons.length ; i++ ) {
        await prisma.lesson.update({
            where: { id: lessons[i].id },
            data: { order: i}
        })
    }
}

export const DeleteLessonById = async (courseId:string, chapterId:string, lessonId:string) => {
    const dirPath = `course-${courseId}/chapter-${chapterId}/lesson-${lessonId}`

    const client = new ftp.Client()
    client.ftp.verbose = true

    await client.access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASS,
        secure: false
    })

    const folderExist = await client.size(dirPath).catch(()=>null)
    if (folderExist) await client.removeDir(dirPath)

    client.close()
    
    await prisma.lesson.delete({
        where: {id: lessonId}
    })

    await ReorderLessonsByChapterId(chapterId)
    return
}

export async function unpublishLesson (lessonId:string) {
    await prisma.lesson.update({
        where: {id: lessonId},
        data: {published: false}
    })
}

export async function publishLesson (lessonId:string) {
    await prisma.lesson.update({
        where: {id: lessonId},
        data: {published: true}
    })
}