import { z } from "zod";

//Templates
const title = z.string().min(1, "Tytuł nie może być pusty");
const courseId = z.string().uuid()
const slug = z.string()
    .min(1, "Slug nie może być pusty")
    .regex(/^[a-z0-9-]+$/, "Slug może zawierać tylko małe litery, cyfry i myślniki")
    .transform((val) => 
        val
          .replace(/^-+|-+$/g, "")  // Usuwa myślniki na początku i na końcu
          .replace(/--+/g, "-")      // Usuwa podwójne myślniki
      )

export const CreateCourseSchema = z.object({
    title
})

export const EditCourseTitleSchema = z.object({
    title,
    courseId
})

export const EditCourseSlugSchema = z.object({
    slug,
    courseId
})