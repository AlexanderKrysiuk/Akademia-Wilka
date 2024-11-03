"use server"

import { prisma } from "@/lib/prisma"
import { CreateChapterSchema } from "@/schemas/chapter"
import { z } from "zod"

export async function CreateChapter (fields: z.infer<typeof CreateChapterSchema>, courseId:string) {
    const validatedData = CreateChapterSchema.parse(fields)
    const { title, slug } = validatedData 

    const existingChapter = await prisma.chapter.findUnique({
        where: {
            courseId_slug: {
                courseId: courseId,
                slug: slug
            }
        }
    })
    if (existingChapter) {
        throw new Error("Podany odnośnik jest już zajęty w tym kursie")
    }

    const lastChapter = await prisma.chapter.findFirst({
        where: {courseId : courseId},
        orderBy: {order: "desc"}
    })

    const newOrder = lastChapter ? lastChapter.order+1 : 0
    
    return await prisma.chapter.create({
        data: {
            courseId: courseId,
            title: title,
            slug: slug,
            order: newOrder
        }
    })
}

export const GetChaptersByCourseId = async (courseId:string) => {
    return await prisma.chapter.findMany({
        where: {courseId: courseId},
        orderBy: { order: "asc"}
    })
}