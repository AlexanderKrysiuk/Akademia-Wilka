"use server"

import { getUserById } from "@/data/user";
import { CreateCourseSchema } from "@/schemas/course"
import * as z from 'zod'

export const create = async (values: z.infer<typeof CreateCourseSchema>, userID: string) => {
    const validatedFields = CreateCourseSchema.safeParse(values);

    if (!validatedFields.success){
        return { success: false, message: "Podane pola są nieprawidłowe" }
    }

    const existingUser = await getUserById(userID)

    if (!existingUser) {
        return { success: false, message: "Nie znaleziono użytkownika!" }
    }

    if (!existingUser?.roles?.teacher) {
        return { success: false, message: "Tylko nauczyciel może utworzyć kurs!" }
    }


}