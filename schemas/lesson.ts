import * as z from 'zod'

const titleTemplate = z.string()
    .min(1, { message: "Podaj poprawny tytuł!" })

export const CreateLessonSchema = z.object({
    title: titleTemplate
})