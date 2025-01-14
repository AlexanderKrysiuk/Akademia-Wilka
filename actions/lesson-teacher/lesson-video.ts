"use server";

import * as ftp from "basic-ftp";
import { prisma } from "@/lib/prisma";
import { Readable } from "stream";
//import ffmpeg from "fluent-ffmpeg";
//import fs from "fs";
//import path from "path";
//import { promisify } from "util";


// PREPARATION FOR HLS

// const writeFile = promisify(fs.writeFile);

// export async function uploadLessonVideo(formdata: FormData) {
//     const server = process.env.FTP_ADDRES;
//     const videoFile = formdata.get("video") as File;
//     const lessonId = formdata.get("lessonId") as string;
//     const duration = formdata.get("duration") as string;
//     const fileName = "index.m3u8";

//     if (!videoFile || !lessonId) throw new Error("Brak wymaganych danych");

//     const ftpFilePath = `/lessons/${lessonId}/hls`;
//     const videoUrl = `${server}/lessons/${lessonId}/hls/${fileName}`;

//     const client = new ftp.Client();
//     client.ftp.verbose = true;

//     // Zapisywanie pliku tymczasowego
//     const tempFilePath = path.join("/tmp", videoFile.name);
//     const buffer = Buffer.from(await videoFile.arrayBuffer());
//     await writeFile(tempFilePath, buffer);

//     // Konwersja do HLS za pomocą FFmpeg
//     const hlsOutputDir = path.join("/tmp", "hls", lessonId);
//     fs.mkdirSync(hlsOutputDir, { recursive: true });

//     await new Promise((resolve, reject) => {
//         ffmpeg(tempFilePath)
//             .outputOptions([
//                 "-codec: copy",
//                 "-hls_time 10",
//                 "-hls_list_size 0",
//                 "-f hls"
//             ])
//             .output(path.join(hlsOutputDir, "index.m3u8"))
//             .on("end", resolve)
//             .on("error", reject)
//             .run();
//     });

//     // Przesyłanie segmentów HLS na serwer FTP
//     try {
//         await client.access({
//             host: process.env.FTP_HOST,
//             user: process.env.FTP_USER,
//             password: process.env.FTP_PASS,
//             secure: false,
//         });

//         await client.ensureDir(ftpFilePath);

//         const files = fs.readdirSync(hlsOutputDir);
//         for (const file of files) {
//             const filePath = path.join(hlsOutputDir, file);
//             await client.uploadFrom(Readable.from(fs.readFileSync(filePath)), `${ftpFilePath}/${file}`);
//         }

//         // Aktualizacja URL w bazie danych
//         const newMedia = [{ url: videoUrl, duration: parseInt(duration) }];
//         await prisma.lesson.update({
//             where: { id: lessonId },
//             data: { media: JSON.stringify(newMedia) },
//         });

//     } catch (error) {
//         console.error("Błąd przesyłania pliku:", error);
//         throw new Error("Błąd przesyłania pliku");
//     } finally {
//         client.close();
//     }

//     // Czyszczenie plików tymczasowych
//     fs.rmSync(tempFilePath);
//     fs.rmSync(hlsOutputDir, { recursive: true, force: true });
// }



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

// PREPARATION FOR HLS
// export async function DeleteVideoIfExist(lessonId: string) {
//     const ftpFilePath = `/lessons/${lessonId}/hls`;

//     const client = new ftp.Client();
//     client.ftp.verbose = true;

//     try {
//         await client.access({
//             host: process.env.FTP_HOST,
//             user: process.env.FTP_USER,
//             password: process.env.FTP_PASS,
//             secure: false,
//         });

//         await client.removeDir(ftpFilePath);
//         console.log(`Folder HLS usunięty pomyślnie.`);
//     } catch (error) {
//         console.error(`Błąd podczas usuwania folderu HLS: ${error}`);
//     } finally {
//         client.close();
//     }
// }
