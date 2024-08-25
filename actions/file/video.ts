"use server"
import { v4 as uuidv4 } from "uuid";
import * as ftp from "basic-ftp";
import { Readable } from "stream";
import path, { join } from "path";
import { getVideoDurationFromBuffer } from "@/lib/video";

export async function uploadVideoLessonToServer(
    videoFile: File,
    lessonID: string
): Promise<{ ID: string, URL: string, Duration: number }> {
    if (!videoFile) throw new Error("Nie znaleziono pliku!");

    const fileServer = process.env.FILE_SERVER_URL;
    const uniqueFileName = uuidv4();
    const originalFileName = videoFile.name;
    const fullFileName = `${uniqueFileName}${path.extname(originalFileName)}`;
    const arrayBuffer = await videoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get the video duration
    const duration = await getVideoDurationFromBuffer(buffer);

    const dirPath = join('lessons', lessonID, 'video');
    const dataPathURL = new URL(`/akademia_wilka/lessons/${lessonID}/video/${fullFileName}`, fileServer);
    const dataPath = dataPathURL.toString();

    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false
        });

        const fileStream = Readable.from(buffer);
        await client.ensureDir(dirPath);
        await client.uploadFrom(fileStream, fullFileName);
    } catch (error) {
        throw new Error("Wystąpił błąd podczas przesyłania filmu!");
    } finally {
        client.close();
    }

    return { ID: uniqueFileName, URL: dataPath, Duration: duration };
}


//const dirPath = join('courses',existingCourse.id,'chapters',existingChapter.id,'lessons',lessonID,'video');
//const dataPathURL = new URL(`/akademia_wilka/courses/${existingCourse.id}/chapters/${existingChapter.id}/lessons/${lessonID}/video/${fullFileName}`, fileServer)