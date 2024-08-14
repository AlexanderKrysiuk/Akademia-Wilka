import * as z from 'zod'

const titleTemplate = z.string()
    .min(1, { message: "Kurs musi posiadać tytuł!"})

const descriptionTemplate = z.string()
    .min(1, { message: "Kurs musi posiadać opis!"})

const categoryIdTemplate = z.string().uuid({ message: "Nieprawidłowy format kategorii!" });

const levelIdTemplate = z.string().uuid({ message: "Nieprawidłowy format poziomu!" })

const priceTemplate = z.coerce.number()
    .min(0, { message: "Cena nie może być mniejsza niż 0" })
    .nullable()

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

export const EditCourseLevelSchema = z.object({
    levelId: levelIdTemplate
})

export const EditCoursePriceSchema = z.object({
    price: priceTemplate
})