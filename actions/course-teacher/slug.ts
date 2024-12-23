"use server"

import { EditCourseSlugSchema } from "@/schemas/course"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { GetCourseById, GetCourseBySlug } from "./course"

export const UpdateCourseSlug = async (fields: z.infer<typeof EditCourseSlugSchema>, courseId:string) => {

    const existingSlug = await GetCourseBySlug(fields.slug)
    if (existingSlug) {
        throw new Error ("Podany odnośnik jest już zajęty")
    }

    const course = await GetCourseById(courseId)
    if (!course) {
        throw new Error ("Nie znaleziono kursu")
    } 

    await prisma.course.update({
        where: { id: courseId },
        data: { slug: fields.slug }
    })
}