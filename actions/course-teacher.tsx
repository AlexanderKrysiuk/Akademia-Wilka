"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CourseSchema } from "@/schema/course";
import { Role } from "@prisma/client";
import { z } from "zod";

export async function CourseCreate(data: z.infer<typeof CourseSchema>) {
    const session = await auth();
    const user = session?.user;
    
    if (!user || user.role !== Role.Admin) {
        throw new Error("Brak autoryzacji");
    }
    
    console.log(user)

    try {
        await prisma.course.create({
            data: {
                title: data.title,
                ownerId: user.id,
            },
        });
    } catch (error) {
        console.error("Błąd tworzenia kursu:", error);
        throw new Error("Utworzenie kursu nieudane");
    }
}