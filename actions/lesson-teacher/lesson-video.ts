"use server"

import * as ftp from "basic-ftp"
import { prisma } from "@/lib/prisma"
import { Readable } from "stream"

export async function uploadLessonVideo(formdata: FormData) {
    const videoFile  = formdata.get("video") as File
    const courseId = formdata.get("courseId") as string
    const chapterId = formdata.get("chapterId") as string
    const lessonId = formdata.get("lessonId") as string
    const duration = formdata.get("duration") as string

    if (!videoFile || !courseId || !chapterId || !lessonId) throw new Error ("Brak wymaganych danych")

    const fileName = `${lessonId}.mp4`
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

    await client.ensureDir(dirPath);

    const list = await client.list('/');
    //console.log("Root directory contents:", list);
    const lessonDirList = await client.list(`course-${courseId}/chapter-${chapterId}/lesson-${lessonId}`);
    //console.log("Chapter directory contents:", lessonDirList);

    //console.log("CHECK")
    const buffer = Buffer.from(await videoFile.arrayBuffer())
    await client.uploadFrom(Readable.from(buffer), fileName)
    //console.log("PASSED")

    const uploadedVideoUrl = `${fileServer}/${dirPath}/${fileName}`

    const newMedia = [{ url: uploadedVideoUrl, duration: parseInt(duration) }]

    await prisma.lesson.update({
        where: {id: lessonId},
        data: {
            media: JSON.stringify(newMedia),
        }
    })

    {/* 
    const existingVideo = await prisma.media.findFirst({
        where: {
            lessonId: lessonId
        }
    })
    
    if (existingVideo) {
        await prisma.media.update({
            where: { id: existingVideo.id },
            data: {
                name: fileName,
                url: uploadedVideoUrl,
                duration: 0,
                updatedAt: new Date()
            }
        })
    } else {
        await prisma.media.create({
            data: {
                name: fileName,
                url: uploadedVideoUrl,
                duration: 0,
                lesson: {
                    connect: {id: lessonId}
                }
            }
        })
    }
    */}
    
    client.close()
    return
}