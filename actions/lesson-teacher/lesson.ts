"use server"

import { prisma } from "@/lib/prisma"
import { CreateLessonSchema } from "@/schemas/lesson"
import { promise, z } from "zod"

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

export const reOrderLessons = async (data: { id:string, position:number}[]) => {
    const updatePromises = data.map(async({id,position})=>{
        return await prisma.lesson.update({
            where: {id},
            data: { order: position}
        })
    })
    await Promise.all(updatePromises)
}