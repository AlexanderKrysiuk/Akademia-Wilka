"use server"

import { prisma } from "@/lib/prisma"
import { EditLessonSlugSchema } from "@/schemas/lesson"
import { z } from "zod"

export async function UpdateLessonSlug(fields: z.infer<typeof EditLessonSlugSchema>, chapterId:string, lessonId:string) {
    const existingSlug = await GetLessonBySlug(fields.slug, chapterId)
    if (existingSlug) {
        throw new Error ("Podany odnośnik jest już zajęty")
    }

    await prisma.lesson.update({
        where: { id: lessonId },
        data: { slug: fields.slug } 
    })
}

export const GetLessonBySlug = async (lessonSlug:string, chapterId:string) => {
    return await prisma.lesson.findUnique({
        where: {
            chapterId_slug: {
                chapterId: chapterId,
                slug: lessonSlug
            }
        }
    })
}