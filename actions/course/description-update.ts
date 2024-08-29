"use server"
import { getUserById } from "@/data/user";
import { EditCourseDescriptionSchema } from "@/schemas/course";
import * as z from 'zod'
import { getCourseById } from "./get";
import { isTeacher } from "@/lib/permissions";

export const updateCourseDescription = async (values: z.infer<typeof EditCourseDescriptionSchema>, userID: string, courseID: string) => {
    const validatedFields = EditCourseDescriptionSchema.safeParse(values)
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
    
    const description = validatedFields.data.description
    
    if (!description) {
        return { success: false, message: "Nie znaleziono tytułu!" }
    }
    
    await prisma?.course.update({
        where: {id: courseID },
        data: {description: description}
    })
    return {success: true, message: "Zmieniono opis kursu"}
}