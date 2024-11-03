import { getChapterBySlug } from '@/actions/course/chapter'
import * as z from 'zod'

const titleTemplate = z.string()
    .min(1, { message: "Rozdział musi posiadać tytuł!" })

const slugTemplate = z.string()
    .min(1, { message: "Rozdział musi mieć unikalny odnośnik" }) // minimalna długość
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Odnośnik może zawierać tylko małe litery, cyfry oraz myślniki i nie może zaczynać się ani kończyć myślnikiem",
    }) // walidacja na dopuszczalne znaki (małe litery, cyfry, myślniki) oraz brak myślnika na początku/końcu
    .max(100, { message: "Odnośnik nie może przekraczać 100 znaków" }); // maksymalna długość
  

export const CreateChapterSchema = z.object({
    title: titleTemplate,
    slug: slugTemplate,
})
  

export const EditChapterSchema = z.object({
    title: titleTemplate,
    slug: slugTemplate,
    published: z.boolean()
})