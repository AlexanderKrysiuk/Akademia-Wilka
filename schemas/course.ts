import * as z from 'zod'

const titleTemplate = z.string()
    .min(1, { message: "Kurs musi posiadać tytuł!"})

const descriptionTemplate = z.string()
    .min(1, { message: "Kurs musi posiadać opis!"})

const priceTemplate = z.coerce.number()
    .nullable()
    .refine(value => value === 0 || value === null || value >= 10, {
        message: "Kurs może być darmowy albo jego cena musi wynosić przynajmniej 10 PLN"
    })

const slugTemplate = z.string()
  .min(1, { message: "Kurs musi mieć unikalny odnośnik" }) // minimalna długość
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Odnośnik może zawierać tylko małe litery, cyfry oraz myślniki i nie może zaczynać się ani kończyć myślnikiem",
  }) // walidacja na dopuszczalne znaki (małe litery, cyfry, myślniki) oraz brak myślnika na początku/końcu
  .max(100, { message: "Odnośnik nie może przekraczać 100 znaków" }); // maksymalna długość


export const EditCourseSlugSchema = z.object({
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

export const PriceSchema = z.object({
    price: priceTemplate
})