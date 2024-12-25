"use server"

import { getUserById } from "@/data/user"
import { prisma } from "@/lib/prisma"
import { Category } from "@prisma/client"
import { GetCourseById } from "./course"
import { AdminGate } from "../gates/gates"

export async function UpdateCourseCategory(category:Category, userId:string, courseId:string) {
    const user = await getUserById(userId)
    if (!user) {
        throw new Error("Użytkownik nie jest zalogowany");
    }

    const course = await GetCourseById(courseId)

    if (!course) {
        throw new Error("Kurs nie istnieje");
    }

    const isAdmin = await AdminGate(userId)

    if (!isAdmin && user.id !== course.ownerId) {
        throw new Error("Brak uprawnień do zmiany kategorii kursu");
    }

    await prisma.course.update({
        where: {id: courseId},
        data: {category: category}
    })

    return "Kategoria została zmieniona pomyślnie";
}