import * as z from 'zod'
import { LessonType } from "@prisma/client";

const slugTemplate = z.string()
    .min(1, { message: "Rozdział musi mieć unikalny odnośnik" }) // minimalna długość
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Odnośnik może zawierać tylko małe litery, cyfry oraz myślniki i nie może zaczynać się ani kończyć myślnikiem",
    }) // walidacja na dopuszczalne znaki (małe litery, cyfry, myślniki) oraz brak myślnika na początku/końcu
    .max(100, { message: "Odnośnik nie może przekraczać 100 znaków" }); // maksymalna długość

const titleTemplate = z.string()
    .min(1, { message: "Podaj poprawny tytuł!" })

export const EditLessonTitleSchema = z.object({
    title: titleTemplate
})

export const EditLessonSlugSchema = z.object({
    slug: slugTemplate
})

export const CreateLessonSchema = z.object({
    title: titleTemplate,
    lessonType: z.nativeEnum(LessonType, { message: 'Typ lekcji jest wymagany' }),
})
