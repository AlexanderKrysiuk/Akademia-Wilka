"use server"

import { getUserById } from "@/data/user"
import { prisma } from "@/lib/prisma"
import { EditCourseLevelSchema } from "@/schemas/course"
import * as z from 'zod'
import { getCourseById } from "./get"
import { isTeacher } from "@/lib/permissions"

export const getLevels = async () => {
    const levels = await prisma.level.findMany()
    return levels
}

export const getLevelByID = async (id: string) => {
    const level = await prisma.level.findUnique({
        where: { id }
    })
    return level
}

export const updateCourseLevel = async (values: z.infer<typeof EditCourseLevelSchema>, userID: string, courseID: string) => {
    const validatedFields = EditCourseLevelSchema.safeParse(values)
    if (!validatedFields.success) {
        return { success: false, message: "Podane pola są nieprawidłowe!" }
    }

    if (!userID) {
        return { success: false, message: "Nie podano właśiciela kursu!"}
    }

    const existingUser = await getUserById(userID)

    if (!existingUser) {
        return { success: false, message: "Nie znaleziono użytkownika!" }
    }

    if (!isTeacher(existingUser)) {
        return { success: false, message: "Nie masz uprawnień do edycji kursu!" };
    }

    const existingCourse = await getCourseById(courseID)

    if (!existingCourse) {
        return { success: false, message: "Nie znaleziono kursu!" }
    }

    if (existingCourse.ownerId !== existingUser.id) {
        return { success: false, message: "Nie jesteś właścicielem tego kursu!" }
    }

    const levelID = validatedFields.data.levelId

    if (!levelID) {
        return { success: false, message: "Nie znaleziono kategorii!" }
    }

    await prisma?.course.update({
        where: {id: courseID },
        data: {levelId: levelID}
    })
    return {success: true, message: "Zmieniono poziom kursu!"}

}