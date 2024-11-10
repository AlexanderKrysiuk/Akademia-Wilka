"use server"

import { EditLessonTitleSchema } from "@/schemas/lesson";
import { prisma } from "@/lib/prisma"
import { z } from "zod";

export async function UpdateLessonTitle (fields: z.infer<typeof EditLessonTitleSchema>, lessonId: string) {
    return await prisma.lesson.update({
        where: { id: lessonId },
        data: { title: fields.title }
    })
}