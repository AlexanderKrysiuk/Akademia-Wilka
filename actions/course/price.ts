"use server"
import { getUserById } from "@/data/user";
import { EditCoursePriceSchema } from "@/schemas/course";
import * as z from 'zod'
import { getCourseById } from "./get";

export const updateCoursePrice = async (values: z.infer<typeof EditCoursePriceSchema>, userID: string, courseID: string) => {
    const validatedFields = EditCoursePriceSchema.safeParse(values)
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
    
    if (!existingUser?.role?.teacher) {
        return { success: false, message: "Nie masz uprawnień do edycji kursu!" }
    }
    
    const existingCourse = await getCourseById(courseID)
    
    if (!existingCourse) {
        return { success: false, message: "Nie znaleziono kursu!" }
    }
    
    if (existingCourse.ownerId !== existingUser.id) {
        return { success: false, message: "Nie jesteś właścicielem tego kursu!" }
    }
    
    const price = validatedFields.data.price

    if (price !== null && price < 0) {
        return { success: false, message: "Cena kursu nie może być mniejsza od zera!" };
    }
    
    await prisma?.course.update({
        where: {id: courseID },
        data: {price: price}
    })
    return {success: true, message: "Zmieniono cenę kursu!"}
}