"use server"

import { PriceSchema } from "@/schemas/course"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function UpdateCoursePrice (fields: z.infer<typeof PriceSchema>, courseId:string) {
    await prisma.course.update({
        where: { id: courseId},
        data: { price: fields.price}
    })
}