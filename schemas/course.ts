import * as z from 'zod'

const titleTemplate = z.string()
    .min(1, { message: "Kurs musi posiadać tytuł!"})

export const CreateCourseSchema = z.object({
    title: titleTemplate
})