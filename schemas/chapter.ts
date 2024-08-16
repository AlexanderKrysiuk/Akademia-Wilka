import * as z from 'zod'

const titleTemplate = z.string()
    .min(1, { message: "Rozdział musi posiadać tytuł!" })

export const CreateChapterSchema = z.object({
    title: titleTemplate
})