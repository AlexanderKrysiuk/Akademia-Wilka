"use server"

import { prisma } from "@/lib/prisma"

export async function GetCategories() {
    return await prisma.category.findMany()
}

export async function UpdateCategory(courseId:string, categoryId:string) {
    await prisma.course.update({
        where: {id: courseId},
        data: {categoryId: categoryId}
    })
}