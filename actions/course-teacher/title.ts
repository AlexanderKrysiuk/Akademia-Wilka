"use server"

import { getUserById, getUserRolesByUserID } from "@/data/user"
import { EditCourseTitleSchema } from "@/schemas/course"
import { z } from "zod"
import { UserRole } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { GetCourseById } from "./course"

export const UpdateCourseTitle = async (fields: z.infer<typeof EditCourseTitleSchema>, courseId:string) => {

    const course = await GetCourseById(courseId)
    if (!course) {
        throw new Error ("Nie znaleziono kursu")
    }

    await prisma.course.update({
        where: { id: courseId },
        data: { title: fields.title }
    })
}