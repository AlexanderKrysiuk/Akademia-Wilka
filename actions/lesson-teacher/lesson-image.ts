"use server"

import { paths } from "@/utils/paths";
import * as ftp from "basic-ftp"
import { Readable } from "stream";
import { prisma } from "@/lib/prisma";
import { sanitizeFileName, slugify } from "@/utils/link";

export async function UploadLessonImage(formData: FormData){
    const server = process.env.FTP_ADDRES
    const file = formData.get("file") as File
    const fileName = 'image'
    const lessonId = formData.get("lessonId") as string
    
    if (!file || !lessonId) {
        throw new Error("Brak pliku lub ID lekcji");
    }

    const ftpFilePath = `/lessons/${lessonId}/${fileName}`;
    const imageUrl = `${server}/lessons/${lessonId}/${fileName}`;

    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    const readableStream = Readable.from(fileBuffer);
    
    const client = new ftp.Client()

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            //secure: false
        })
        await client.ensureDir(`/lessons/${lessonId}`);
        await client.uploadFrom(readableStream, ftpFilePath);
        await prisma.lesson.update({
            where: {id: lessonId},
            data: {ImageURL: imageUrl}
        })
    } catch(error) {
        console.error("Błąd przesyłania pliku:", error);
        throw new Error("Błąd przesyłania pliku");
    } finally {
        client.close()
    }

}
// "use server"

// import * as ftp from "basic-ftp"
// import { Readable } from "stream"
// import { prisma } from "@/lib/prisma"

// export async function UploadLessonImage (dataURL: string, lessonId:string) {
//     if (!dataURL || !lessonId) throw new Error("Brak wymaganych danych")

//     const fileName = `${lessonId}.png`
//     const dirPath = `lessons/${lessonId}`
//     const fileServer = process.env.FTP_ADDRES

//     const client = new ftp.Client()
//     client.ftp.verbose = true

//     await client.access({
//         host: process.env.FTP_HOST,
//         user: process.env.FTP_USER,
//         password: process.env.FTP_PASS,
//         secure: false
//     })
    
//     const base64Data = dataURL.replace(/^data:image\/\w+;base64,/, "");
//     const buffer = Buffer.from(base64Data, "base64")

//     await client.ensureDir(dirPath)
//     await client.uploadFrom(Readable.from(buffer), fileName)

//     const uploadedImageUrl = `${fileServer}/${dirPath}/${fileName}`
//     await prisma.lesson.update({
//         where: {id: lessonId},
//         data: {ImageURL: uploadedImageUrl}
//     })
//     client.close()
// }