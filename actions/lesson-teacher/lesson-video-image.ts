"use server"

import * as ftp from "basic-ftp"
import { Readable } from "stream"
import { prisma } from "@/lib/prisma"

export async function UploadLessonVideoImage(dataURL: string, courseId:string, chapterId:string, lessonId:string) {
    if (!dataURL || !courseId || !chapterId || !lessonId) throw new Error("Brak wymaganych danych")

    const fileName = `${lessonId}.png`
    const dirPath = `courses/course-${courseId}/chapter-${chapterId}/lesson-${lessonId}`
    const fileServer = process.env.FTP_ADDRES

    const client = new ftp.Client()
    client.ftp.verbose = true

    await client.access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASS,
        secure: false
    })

    const base64Data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64")

    await client.ensureDir(dirPath)
    await client.uploadFrom(Readable.from(buffer), fileName)

    const uploadedImageUrl = `${fileServer}/${dirPath}/${fileName}`
    await prisma.lesson.update({
        where: {id: lessonId},
        data: {ImageURL: uploadedImageUrl}
    })
    client.close()
}