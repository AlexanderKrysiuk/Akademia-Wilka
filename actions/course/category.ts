"use server"
import { getUserById } from "@/data/user"
import { prisma } from "@/lib/prisma"
import { EditCourseCategorySchema } from "@/schemas/course"
import { z } from "zod"
import { getCourseById } from "./get"
import { isTeacher } from "@/lib/permissions"

export const getCategories = async () => {
    const categories = await prisma.category.findMany()
    return categories
}

export const getCategoryByID = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { id } 
    })
    return category
}

export const updateCourseCategory = async (values: z.infer<typeof EditCourseCategorySchema>, userID: string, courseID: string) => {
    const validatedFields = EditCourseCategorySchema.safeParse(values)
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

    const categoryID = validatedFields.data.categoryId

    if (!categoryID) {
        return { success: false, message: "Nie znaleziono kategorii!" }
    }

    await prisma?.course.update({
        where: {id: courseID },
        data: {categoryId: categoryID}
    })
    return {success: true, message: "Zmieniono kategorię kursu"}

}