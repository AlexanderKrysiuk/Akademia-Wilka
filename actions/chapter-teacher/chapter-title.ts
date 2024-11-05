"use server"

import { EditChapterTitleSchema } from "@/schemas/chapter";
import { prisma } from "@/lib/prisma"
import { z } from "zod";

export async function UpdateChapterTitle (fields: z.infer<typeof EditChapterTitleSchema>, chapterId:string) {
    return await prisma.chapter.update({
        where: { id: chapterId },
        data: { title: fields.title }
    })
}