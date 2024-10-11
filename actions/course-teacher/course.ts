"use server"

import { getUserById, getUserRolesByUserID } from "@/data/user"
import { prisma } from "@/lib/prisma"
import { CreateCourseSchema } from "@/schemas/course"
import { User } from "@auth/core/types"
import { UserRole } from "@prisma/client"
import { z } from "zod"

export const CreateCourse = async (fields: z.infer<typeof CreateCourseSchema>, userId:string) => {
    const user = await getUserById(userId)
    const roles = await getUserRolesByUserID(userId)
    if (!user || !roles.includes(UserRole.Teacher || UserRole.Admin)){
        throw new Error ("Brak uprawień")
    }

    const course = await prisma.course.create({
        data: {
            title: fields.title,
            ownerId: userId
        }
    })

    return course.id
}

export const GetMyCreatedCourses = async (userId:string) => {
    return await prisma.course.findMany({
        where: { ownerId: userId}
    })
}

export const GetMyCreatedCourse = async (userId:string, courseId:string) => {
    const course = await prisma.course.findUnique({
        where: { id: courseId }
    })
    if (course?.ownerId !== userId) return null
    return course
}

const UpdateCourse = async () => {

}

const DeleteCourse = async () => {

}