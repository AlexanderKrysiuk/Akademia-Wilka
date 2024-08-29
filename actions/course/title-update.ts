"use server"
import { getUserById } from "@/data/user";
import { EditCourseTitleSchema } from "@/schemas/course";
import * as z from 'zod'
import { getCourseById } from "./get";
import { UserRole } from "@prisma/client";
import { isTeacher } from "@/lib/permissions";

export const updateCourseTitle = async (values: z.infer<typeof EditCourseTitleSchema>, userID: string, courseID: string) => {
    const validatedFields = EditCourseTitleSchema.safeParse(values)
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
    
    const title = validatedFields.data.title
    
    if (!title) {
        return { success: false, message: "Nie znaleziono tytułu!" }
    }
    
    await prisma?.course.update({
        where: {id: courseID },
        data: {title: title}
    })
    return {success: true, message: "Zmieniono tytuł kursu"}
}