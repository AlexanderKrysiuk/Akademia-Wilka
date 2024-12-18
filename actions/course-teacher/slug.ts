"use server"

import { getUserById, getUserRolesByUserID } from "@/data/user"
import { EditCourseSlugSchema } from "@/schemas/course"
import { UserRole } from "@prisma/client"
import { z } from "zod"
import { getCourseById } from "../course/get"
import { prisma } from "@/lib/prisma"
import { getCourseBySlug } from "../course/course"

export const UpdateCourseSlug = async (fields: z.infer<typeof EditCourseSlugSchema>, courseId:string) => {

    const existingSlug = await getCourseBySlug(fields.slug)
    if (existingSlug) {
        throw new Error ("Podany odnośnik jest już zajęty")
    }

    const course = await getCourseById(courseId)
    if (!course) {
        throw new Error ("Nie znaleziono kursu")
    } 

    await prisma.course.update({
        where: { id: courseId },
        data: { slug: fields.slug }
    })
}