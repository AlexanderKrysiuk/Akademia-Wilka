import { z } from "zod";

//Templates
const title = z.string().min(1, "Tytuł nie może być pusty");
const courseId = z.string().uuid()

export const CreateCourseSchema = z.object({
    title
})

export const EditCourseTitleSchema = z.object({
    title,
    courseId
})