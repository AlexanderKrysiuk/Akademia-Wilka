"use server"

import { getUserById, getUserRolesByUserID } from "@/data/user"
import { SlugSchema } from "@/schemas/course"
import { UserRole } from "@prisma/client"
import { z } from "zod"
import { getCourseById } from "../course/get"
import { prisma } from "@/lib/prisma"
import { getCourseBySlug } from "../course/course"

export const UpdateCourseSlug = async (fields: z.infer<typeof SlugSchema>, userId:string, courseId:string) => {
    const user = await getUserById(userId)
    if (!user) {
        throw new Error ("Brak uprawnień")
    }

    const roles = await getUserRolesByUserID(userId)
    if (!roles || !roles.includes(UserRole.Teacher || UserRole.Admin)) {
        throw new Error ("Brak uprawnień")
    }

    const existingSlug = await getCourseBySlug(fields.slug)
    if (existingSlug) {
        throw new Error ("Podany odnośnik jest już zajęty")
    }

    const course = await getCourseById(courseId)
    if (!course) {
        throw new Error ("Nie znaleziono kursu")
    } 

    if (course.ownerId !== user.id) {
        throw new Error ("Brak uprawnień")
    }

    await prisma.course.update({
        where: { id: courseId },
        data: { slug: fields.slug }
    })
}