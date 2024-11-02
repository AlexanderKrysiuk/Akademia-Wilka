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

const slugTemplate = z.string()
  .min(1, { message: "Kurs musi mieć unikalny odnośnik" }) // minimalna długość
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Odnośnik może zawierać tylko małe litery, cyfry oraz myślniki i nie może zaczynać się ani kończyć myślnikiem",
  }) // walidacja na dopuszczalne znaki (małe litery, cyfry, myślniki) oraz brak myślnika na początku/końcu
  .max(100, { message: "Odnośnik nie może przekraczać 100 znaków" }); // maksymalna długość


export const SlugSchema = z.object({
    slug: slugTemplate
})

export const CreateCourseSchema = z.object({
    title: titleTemplate
})

export const EditCourseTitleSchema = z.object({
    title: titleTemplate
})

export const EditCourseDescriptionSchema = z.object({
    description: descriptionTemplate
})

export const CategorySchema = z.object({
    categoryId: categoryIdTemplate
})

export const EditCourseLevelSchema = z.object({
    levelId: levelIdTemplate
})

export const EditCoursePriceSchema = z.object({
    price: priceTemplate
})