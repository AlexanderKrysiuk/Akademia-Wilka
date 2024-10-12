"use server"

import { getUserById, getUserRolesByUserID } from "@/data/user"
import { EditCourseTitleSchema } from "@/schemas/course"
import { z } from "zod"
import { getCourseById } from "../course/get"
import { UserRole } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export const UpdateCourseTitle = async (fields: z.infer<typeof EditCourseTitleSchema>, userId:string, courseId:string) => {
    const user = await getUserById(userId)
    if (!user) {
        throw new Error ("Brak uprawnień")
    }
    
    const roles = await getUserRolesByUserID(userId)
    if (!roles || !roles.includes(UserRole.Teacher || UserRole.Admin)) {
        throw new Error ("Brak uprawnień")
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
        data: { title: fields.title }
    })
}