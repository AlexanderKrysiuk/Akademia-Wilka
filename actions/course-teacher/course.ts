"use server"

import getServerSession from "next-auth";


import { getUserById, getUserRolesByUserID } from "@/data/user"
import { prisma } from "@/lib/prisma"
import { CreateCourseSchema } from "@/schemas/course"
import { UserRole } from "@prisma/client"
import { z } from "zod"
import { auth } from "@/auth";

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

export const GetCourseBySlug = async (slug:string) => {
    return await prisma.course.findUnique({
        where: { slug: slug }
    })
}

export const GetCourseById = async (courseId:string) => {
    return await prisma.course.findUnique({
        where: { id: courseId}
    })
}

export const GetMyCreatedCourses = async (userId:string) => {
    const roles = await getUserRolesByUserID(userId)
    if (!roles.includes(UserRole.Teacher || UserRole.Admin)) {
        throw new Error("Brak uprawień!")
    }
    return await prisma.course.findMany({
        where: { ownerId: userId}
    })
}

export const GetMyCreatedCourse = async (courseId:string) => {
    const session = await auth()
    const course = await prisma.course.findUnique({
        where: { id: courseId }
    })
    if (!course || !session || (course.ownerId !== session.user.id && session.user.role.includes(UserRole.Admin))) {
        throw new Error("Brak uprawnień");
    }
    return course
}
 
const UpdateCourse = async () => {

}

const DeleteCourse = async () => {

}

export async function unpublishCourse (courseId:string) {
    await prisma.course.update({
        where: {id: courseId},
        data: {published: false}
    })
}

export async function publishCourse (courseId:string) {
    await prisma.course.update({
        where: {id: courseId},
        data: {published: true}
    })
}