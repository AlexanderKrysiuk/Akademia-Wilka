"use server"

import { EditChapterSlugSchema } from "@/schemas/chapter";
import { prisma } from "@/lib/prisma"
import { z } from "zod";
import { GetChapterBySlug } from "./chapter";



export async function UpdateChapterSlug (fields: z.infer<typeof EditChapterSlugSchema>, courseId:string, chapterId:string) {
    const existingSlug = await GetChapterBySlug(fields.slug, courseId)
    if (existingSlug) {
        throw new Error ("Podany odnośnik jest już zajęty")
    }
    
    await prisma.chapter.update({
        where: { id: chapterId },
        data: { slug: fields.slug }
    })
}