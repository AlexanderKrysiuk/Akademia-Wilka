"use server"

import * as ftp from "basic-ftp"
import { prisma } from "@/lib/prisma"
import { CreateChapterSchema } from "@/schemas/chapter"
import { z } from "zod"

export async function CreateChapter (fields: z.infer<typeof CreateChapterSchema>, courseId:string) {

    const lastChapter = await prisma.chapter.findFirst({
        where: {courseId : courseId},
        orderBy: {order: "desc"}
    })

    const newOrder = lastChapter ? lastChapter.order+1 : 0
    
    return await prisma.chapter.create({
        data: {
            courseId: courseId,
            title: fields.title,
            order: newOrder
        }
    })
}

export const GetChaptersByCourseId = async (courseId:string) => {
    return await prisma.chapter.findMany({
        where: {courseId: courseId},
        orderBy: { order: "asc"}
    })
}

export const GetChapterById = async (chapterId:string) => {
    return await prisma.chapter.findUnique({
        where: {id: chapterId}
    })
}

export const GetChapterBySlug = async (chapterSlug:string, courseId:string) => {
    return await prisma.chapter.findUnique({
        where: {
            courseId_slug: {
                courseId: courseId,
                slug: chapterSlug
            }
        }
    })
}

export async function unpublishChapter (chapterId:string) {
    await prisma.chapter.update({
        where: {id: chapterId},
        data: {published: false}
    })
}

export async function publishChapter (chapterId:string) {
    await prisma.chapter.update({
        where: {id: chapterId},
        data: {published: true}
    })
}

export const reOrderChapters = async (data: { id: string, position: number}[]) => {
    const updatePromises = data.map(async ({ id, position }) => {
        return await prisma.chapter.update({
            where: { id },
            data: { order: position}
        })

    })
    await Promise.all(updatePromises)
}

export const ReorderChaptersByCourseId = async (courseId:string) => {
    const chapters = await GetChaptersByCourseId(courseId)

    for (let i = 0 ; i < chapters.length ; i++ ) {
        await prisma.chapter.update({
            where: { id: chapters[i].id },
            data: { order: i }
        })
    }
}

export const DeleteChapterById = async (courseId:string, chapterId:string) => {
    const dirPath = `courses/course-${courseId}/chapter-${chapterId}`

    const client = new ftp.Client()
    client.ftp.verbose = true

    await client.access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASS,
        secure: false
    })

    const folderExist = await client.size(dirPath).catch(() => null)
    if (folderExist) await client.removeDir(dirPath)

    client.close()

    await prisma.chapter.delete({
        where: { id: chapterId }
    })

    await ReorderChaptersByCourseId(courseId)
    return
}