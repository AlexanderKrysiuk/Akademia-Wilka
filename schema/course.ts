import { z } from "zod";

//Templates
const title = z.string().min(1)

export const CourseSchema = z.object({
    title
})