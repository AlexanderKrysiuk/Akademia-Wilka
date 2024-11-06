import * as z from 'zod'
import { LessonType } from "@prisma/client";

const titleTemplate = z.string()
    .min(1, { message: "Podaj poprawny tytuł!" })

export const EditLessonTitleSchema = z.object({
    title: titleTemplate
})

export const CreateLessonSchema = z.object({
    title: titleTemplate,
    lessonType: z.nativeEnum(LessonType, { message: 'Typ lekcji jest wymagany' }),
})
