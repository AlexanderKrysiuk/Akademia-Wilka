import { getChapterBySlug } from '@/actions/course/chapter'
import * as z from 'zod'

const titleTemplate = z.string()
    .min(1, { message: "Rozdział musi posiadać tytuł!" })

const slugTemplate = z.string()
    .min(1, { message: "Rozdział musi posiadać unikalny odnośnik!"})

export const CreateChapterSchema = z.object({
    title: titleTemplate,
    slug: slugTemplate,
})
  

export const EditChapterSchema = z.object({
    title: titleTemplate,
    slug: slugTemplate,
    published: z.boolean()
})