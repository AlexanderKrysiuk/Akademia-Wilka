"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateCourseSchema, EditCourseSlugSchema, EditCourseTitleSchema } from "@/schema/course";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { TypeOf, z } from "zod";

export async function CourseCreate(data: z.infer<typeof CreateCourseSchema>) {
    const session = await auth();
    const user = session?.user;
    
    if (!user) redirect("/auth/start")

    const existingUser = await prisma.user.findUnique({
        where: { id: user.id}
    })
    
    if (!existingUser) redirect("/auth/start")
    
    if (existingUser.role !== Role.Admin && existingUser.role !== Role.Teacher) throw new Error("Brak autoryzacji")
    
    try {
        await prisma.course.create({
            data: {
                title: data.title,
                ownerId: existingUser.id,
            },
        });
    } catch (error) {
        throw new Error("Snychronizacja bazy danych nieudana")
    }
}

export async function PublishCourse(courseId: string) {
    const session = await auth()
    const user = session?.user

    if (!user) redirect("/auth/start")

    const existingUser = await prisma.user.findUnique({
        where: { id: user.id}
    })

    if (!existingUser) redirect("/auth/start")

    // Pobieramy kurs
    const course = await prisma.course.findUnique({
        where: { id: courseId }
    });

    if (!course) throw new Error("Kurs nie istnieje");

    // Sprawdzamy, czy użytkownik to właściciel lub admin
    if (course.ownerId !== existingUser.id && existingUser.role !== Role.Admin) throw new Error("Brak autoryzacji");
    

    try {
        // Przełączamy status publikacji
        await prisma.course.update({
            where: { id: course.id },
            data: { public: !course.public }
        });
    } catch(error) {
        throw new Error("Snychronizacja bazy danych nieudana")
    }
}

export async function EditCourseTitle (data: z.infer<typeof EditCourseTitleSchema>) {
    const session = await auth();
    const user = session?.user;
    
    if (!user) redirect("/auth/start")

    const existingUser = await prisma.user.findUnique({
        where: { id: user.id}
    })
    
    if (!existingUser) redirect("/auth/start")
    
    // Pobieramy kurs
    const course = await prisma.course.findUnique({
        where: { id: data.courseId }
    });

    if (!course) throw new Error("Kurs nie istnieje");

    // Sprawdzamy, czy użytkownik to właściciel lub admin
    if (course.ownerId !== existingUser.id && existingUser.role !== Role.Admin) throw new Error("Brak autoryzacji");
        
    try {
        await prisma.course.update({
            where: { id: course.id },
            data: { title: data.title },
        });
    } catch (error) {
        throw new Error("Snychronizacja bazy danych nieudana")
    }
}

export async function EditCourseSlug (data: z.infer<typeof EditCourseSlugSchema>) {
    const session = await auth();
    const user = session?.user;

    if (!user) redirect("/auth/start")

    const existingUser = await prisma.user.findUnique({
        where: {id: user.id}
    })

    if (!existingUser) redirect("/auth/start")

    const course = await prisma.course.findUnique({
        where: {id: data.courseId}
    })

    if (!course) throw new Error("Kurs nie istnieje")

    if (course.ownerId !== existingUser.id && existingUser.role !== Role.Admin) throw new Error("Brak autoryzacji")

    try {
        await prisma.course.update({
            where: {id: course.id},
            data: {slug: data.slug}
        })
    } catch(error) {
        throw new Error("Snychronizacja bazy danych nieudana")
    }
}