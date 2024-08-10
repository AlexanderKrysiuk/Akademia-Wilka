import * as z from 'zod'

const titleTemplate = z.string()
    .min(1, { message: "Kurs musi posiadać tytuł!"})

const descriptionTemplate = z.string()
    .min(1, { message: "Kurs musi posiadać opis!"})


export const CreateCourseSchema = z.object({
    title: titleTemplate
})

export const EditCourseTitleSchema = z.object({
    title: titleTemplate
})

export const EditCourseDescriptionSchema = z.object({
    description: descriptionTemplate
})