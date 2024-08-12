"use server"
import { prisma } from "@/lib/prisma"

export const getCategories = async () => {
    const categories = await prisma.category.findMany()
    return categories
}