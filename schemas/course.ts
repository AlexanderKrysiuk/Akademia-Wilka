import * as z from 'zod'

const titleTemplate = z.string()
    .min(1, { message: "Kurs musi posiadać tytuł!"})

const descriptionTemplate = z.string()
    .min(1, { message: "Kurs musi posiadać opis!"})

const categoryIdTemplate = z.string().uuid({ message: "Nieprawidłowy format kategorii!" });

export const CreateCourseSchema = z.object({
    title: titleTemplate
})

export const EditCourseTitleSchema = z.object({
    title: titleTemplate
})

export const EditCourseDescriptionSchema = z.object({
    description: descriptionTemplate
})

export const EditCourseCategorySchema = z.object({
    categoryId: categoryIdTemplate
})