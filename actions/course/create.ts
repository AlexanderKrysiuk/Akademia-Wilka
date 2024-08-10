"use server"

import { getUserById } from "@/data/user";
import { prisma } from "@/lib/prisma";
import { CreateCourseSchema } from "@/schemas/course"
import { v4 as uuidv4 } from "uuid";
import * as z from 'zod'

export const create = async (values: z.infer<typeof CreateCourseSchema>, userID: string) => {
    const validatedFields = CreateCourseSchema.safeParse(values);

    if (!validatedFields.success){
        return { success: false, message: "Podane pola są nieprawidłowe!" }
    }

    if (!userID) {
        return { success: false, message: "Nie podano właśiciela kursu!"}
    }

    const existingUser = await getUserById(userID)

    if (!existingUser) {
        return { success: false, message: "Nie znaleziono użytkownika!" }
    }

    if (!existingUser?.role?.teacher) {
        return { success: false, message: "Nie masz uprawnień do utworzenia kursu!" }
    }

    const title = validatedFields.data.title

    if (!title) {
        return { success: false, message: "Nie znaleziono tytułu!" }
    }

    const courseId = uuidv4()

    const course = await prisma.course.create({
        data: {
            id: courseId,
            title: title,
            ownerId: userID
        }
    })

    return { success: true, message: "Utworzono kurs!", course: course}

}