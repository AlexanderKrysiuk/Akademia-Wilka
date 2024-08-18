"use server"
import { getUserById } from "@/data/user"
import { prisma } from "@/lib/prisma"
import { CreateChapterSchema, EditChapterSchema } from "@/schemas/chapter"
import * as z from 'zod'
import { getCourseById } from "./get"
import { v4 as uuidv4 } from "uuid";

export const getChaptersByCourseID = async (id: string) => {
    const chapters = await prisma.chapter.findMany({
        where: { courseId: id}
    })
    return chapters
}

export const getChapterByID = async (id: string) => {
    const chapter = await prisma.chapter.findUnique({
        where: { id }
    })
    return chapter
}

export const getHighestOrderChapterByCourseID = async (id:string) => {
    const highestOrderChapter = await prisma.chapter.findFirst({
        where: { id: id },
        orderBy: { order: 'desc' } 
    })
    return highestOrderChapter
}

export const createChapter = async (values: z.infer<typeof CreateChapterSchema>, courseID: string, userID: string) => {
    const validatedFields = CreateChapterSchema.safeParse(values)

    if (!validatedFields.success){
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
        return { success: false, message: "Nie masz uprawnień do utworzenia kursu!" }
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
        return { success: false, message: "Nie podano tytułu rozdziału!" }
    }

    const chapterID = uuidv4()

    const highestOrderChapter = await getHighestOrderChapterByCourseID(courseID)
    const newOrder = highestOrderChapter ? highestOrderChapter.order + 1 : 1;

    await prisma.chapter.create({
        data: {
            id: chapterID,
            title: title,
            courseId: existingCourse.id,
            order: newOrder
        }
    })

    return { success: true, message: "Utworzono nowy rozdział!"}
}

export const deleteChapterByID = async (chapterID: string, userID: string, courseID: string) => {
    const existingChapter = await getChapterByID(chapterID)

    if (!existingChapter) {
        return { success: false, message: "Nie znaleziono rodziału!" }
    }

    const existingCourse = await getCourseById(courseID)

    if (!existingCourse) {
        return { success: false, message: "Nie znaleziono kursu!" }
    }

    const existingUser = await getUserById(userID)

    if (!existingUser) {
        return { success: false, message: "Nie znaleziono użytkownika!" }
    }

    if (!existingUser?.role?.teacher) {
        return { success: false, message: "Nie masz uprawnień do usunięcia tego rozdziału!" }
    }

    if (existingCourse.ownerId !== existingUser.id) {
        return { success: false, message: "Nie jesteś właścicielem tego kursu!" }
    }

    if (existingCourse.id !== existingChapter.courseId) {
        return { success: false, message: "Ten rozdział nie należy do tego kursu!"}
    }

    const deletedChapter = await prisma.chapter.delete({
        where: { id: existingChapter.id }
    })

    await prisma.chapter.updateMany({
        where: {
          courseId: courseID,
          order: { gt: deletedChapter.order },  // Znajdź rozdziały o wyższej wartości order
        },
        data: {
          order: {
            decrement: 1,  // Zmniejsz wartość order o 1
          },
        },
      });

    return { success: true, message: "Pomyślnie usunięto rozdział!" }
}

export const updateChapterByID = async (values: z.infer<typeof EditChapterSchema>, chapterID: string, userID: string, courseID: string) => {
    const validatedFields = CreateChapterSchema.safeParse(values)

    if (!validatedFields.success){
        return { success: false, message: "Podane pola są nieprawidłowe!" }
    }

    const existingChapter = await getChapterByID(chapterID)

    if (!existingChapter) {
        return { success: false, message: "Nie znaleziono rodziału!" }
    }

    const existingCourse = await getCourseById(courseID)

    if (!existingCourse) {
        return { success: false, message: "Nie znaleziono kursu!" }
    }

    const existingUser = await getUserById(userID)

    if (!existingUser) {
        return { success: false, message: "Nie znaleziono użytkownika!" }
    }

    if (!existingUser?.role?.teacher) {
        return { success: false, message: "Nie masz uprawnień do usunięcia tego rozdziału!" }
    }

    if (existingCourse.ownerId !== existingUser.id) {
        return { success: false, message: "Nie jesteś właścicielem tego kursu!" }
    }

    if (existingCourse.id !== existingChapter.courseId) {
        return { success: false, message: "Ten rozdział nie należy do tego kursu!"}
    }

    const title = validatedFields.data.title
    
    if (!title) {
        return { success: false, message: "Nie podano tytułu rozdziału!" }
    }

    await prisma.chapter.update({
        where: { id: existingChapter.id },
        data: {
            title: title
        }
    })

    return { success: true, message: "Pomyślnie zmieniono tytuł rozdziału!" }
}


export const moveChapter = async (courseId: string, chapterId: string, newPosition: number) => {
    return prisma.$transaction(async (prisma) => {
        // Pobierz wszystkie rozdziały w kursie
        const chapters = await prisma.chapter.findMany({
            where: { courseId: courseId },
            orderBy: { order: 'asc' }
        });

        const chapterToMove = chapters.find(chapter => chapter.id === chapterId);

        if (!chapterToMove) {
            throw new Error("Rozdział nie został znaleziony.");
        }

        // Upewnij się, że newPosition jest w odpowiednim zakresie
        if (newPosition < 1 || newPosition > chapters.length) {
            throw new Error("Nowa pozycja jest poza dozwolonym zakresem.");
        }

        // 1. Usuń rozdział z obecnej pozycji
        await prisma.chapter.updateMany({
            where: {
                courseId: courseId,
                order: { gt: chapterToMove.order }
            },
            data: {
                order: {
                    decrement: 1
                }
            }
        });

        // 2. Dodaj rozdział na nową pozycję
        await prisma.chapter.updateMany({
            where: {
                courseId: courseId,
                order: { gte: newPosition }
            },
            data: {
                order: {
                    increment: 1
                }
            }
        });

        // 3. Ustaw nową pozycję dla przenoszonego rozdziału
        await prisma.chapter.update({
            where: { id: chapterId },
            data: { order: newPosition }
        });

        return { success: true, message: "Rozdział został przeniesiony." };
    });
}

export const reOrderChapters = async (Data: { id: string, position: number }[], userID: string, courseID:string) => {
    
    const existingUser = await getUserById(userID)

    if (!existingUser) {
        return { success: false, message: "Nie znaleziono użytkownika!" }
    }

    if (!existingUser?.role?.teacher) {
        return { success: false, message: "Nie masz uprawnień do usunięcia tego rozdziału!" }
    }

    const existingCourse = await getCourseById(courseID)

    if (!existingCourse) {
        return { success: false, message: "Nie znaleziono kursu!" }
    }

    if (existingCourse.ownerId !== existingUser.id) {
        return { success: false, message: "Nie jesteś właścicielem tego kursu!" }
    }

    if (!Data) {
        return { success: false, message: "Nie wykrto listy do zaktualizowania!" }
    }

    const updatePromises = Data.map(async ({ id, position }) => {
        return await prisma.chapter.update({
            where: { id },
            data: { order: position }
        });
    });

    await Promise.all(updatePromises);

    return { success: true, message: "Kolejność rozdziałów została zaktualizowana!" }
}