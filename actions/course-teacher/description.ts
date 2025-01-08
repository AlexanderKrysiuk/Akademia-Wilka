"use server"

import { auth } from "@/auth"
import { EditCourseDescriptionSchema } from "@/schemas/course"
import { UserRole } from "@prisma/client"
import { z } from "zod"
import { GetCourseById } from "./course"
import { prisma } from "@/lib/prisma"

export const UpdateCourseDescription = async (fields: z.infer<typeof EditCourseDescriptionSchema>, courseId:string) => {
    const session = await auth()
    const user = session?.user

    if (!user) throw new Error("Brak uprawnień")

    const course = await GetCourseById(courseId)
    if (!course) throw new Error("Nie znaleziono kursu")

    if (course.ownerId !== user.id && !user.role.includes(UserRole.Admin)) {
        throw new Error("Brak uprawnień do edytowania tego kursu")
    }
    
    await prisma.course.update({
        where: { id: course.id },
        data: { description: fields.description } 
    })
}