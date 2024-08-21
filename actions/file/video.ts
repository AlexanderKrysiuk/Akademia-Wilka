"use server"
import { getUserById } from "@/data/user";
import { v4 as uuidv4 } from "uuid";
import { getChapterByID } from "../course/chapter";
import { getCourseById } from "../course/get";
import path, { join } from "path";
import * as ftp from "basic-ftp";
import { Readable } from "stream";
import { prisma } from "@/lib/prisma"; // Zakładając, że używasz Prisma
import { VideoSource } from "@prisma/client";

export async function uploadVideoLessonToServer(
    videoFile: File,
    userID: string,
    chapterID: string,
    lessonID: string,
) {
    if (!videoFile) {
        return
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

    const existingChapter = await getChapterByID(chapterID)

    if (!existingChapter) {
        return { success: false, message: "Nie znaleziono rozdziału do którego chcesz przypsiać lekcję!" }
    }

    const existingCourse = await getCourseById(existingChapter.courseId)

    if (!existingCourse) {
        return { success: false, message: "Nie znaleziono kursu do którego chcesz przypisać lekcję!" }
    }

    if (existingCourse.ownerId !== existingUser.id) {
        return { success: false, message: "Nie jesteś właścicielem tego kursu!" }
    }

    const fileServer = process.env.FILE_SERVER_URL;
    const uniqueFileName = uuidv4()
    const originalFileName = videoFile.name
    const fullFileName = `${uniqueFileName}${path.extname(originalFileName)}`

    const dirPath = join('courses',existingCourse.id,'chapters',existingChapter.id,'lessons',lessonID,'video');
    const dataPathURL = new URL(`/akademia_wilka/courses/${existingCourse.id}/chapters/${existingChapter.id}/lessons/${lessonID}/video/${fullFileName}`, fileServer)
    const dataPath = dataPathURL.toString();

    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false
        })

        const arrayBuffer = await videoFile.arrayBuffer();
        const fileStream = Readable.from(Buffer.from(arrayBuffer))

        await client.ensureDir(dirPath);
        await client.uploadFrom(fileStream, fullFileName);

        await prisma.videoLesson.create({
            data: {
                name: originalFileName,
                url: dataPath,
                lessonId: lessonID,
                source: VideoSource.internal
            }
        })
    } catch (error) {
        return { success: false, message: "Wystąpił błąd podczas przesyłania filmu!" }
    } finally {
        client.close()
    }
    return { success: true, message: "Pomyślnie przesłano film!", dataPath }
} 