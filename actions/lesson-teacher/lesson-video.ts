"use server"

import * as ftp from "basic-ftp"
import { prisma } from "@/lib/prisma"
import { Readable } from "stream"

export async function uploadLessonVideo(formdata: FormData) {
    const server = process.env.FTP_ADDRES
    const videoFile  = formdata.get("video") as File
    const lessonId = formdata.get("lessonId") as string
    const duration = formdata.get("duration") as string
    const fileName = 'video'

    if (!videoFile || !lessonId) throw new Error ("Brak wymaganych danych")

    const ftpFilePath = `/lessons/${lessonId}/${fileName}`
    const videoUrl = `${server}/lessons/${lessonId}/${fileName}`

    const client = new ftp.Client()
    client.ftp.verbose = true
    
    const buffer = Buffer.from(await videoFile.arrayBuffer())
    
    try {
        
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false
        })
        await client.ensureDir(`/lessons/${lessonId}`);
        await client.uploadFrom(Readable.from(buffer), ftpFilePath)
        const newMedia = [{ url: videoUrl, duration: parseInt(duration)}]
        await prisma.lesson.update({
            where: {id: lessonId},
            data: {
                media: JSON.stringify(newMedia),
            }
        })
    } catch(error) {
        console.error("Błąd przesyłania pliku:", error);
        throw new Error("Błąd przesyłania pliku");
    } finally {
        client.close()
    }
}

export async function DeleteVideoIfExist(lessonId:string) {
    const ftpFilePath = `/lessons/${lessonId}`
    const fileName = `video`

    const client = new ftp.Client()
    client.ftp.verbose = true

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false
        })
        try {
            await client.remove(ftpFilePath + "/" + fileName);
            console.log(`Plik ${fileName} usunięty pomyślnie.`);
        } catch (error) {
            console.log(error)
        }
        
    } catch (error) {
        console.error(`Błąd podczas łączenia z serwerem FTP: ${error}`);
    } finally {
        client.close()
    } 
}

export async function UpdateVideoSource(videoUrl:string) {
    //await prisma.lesson.
}