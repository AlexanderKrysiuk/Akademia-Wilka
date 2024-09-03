"use server"
import { v4 as uuidv4 } from "uuid";
import * as ftp from "basic-ftp";
import { Readable } from "stream";
import path, { join } from "path";
import { getLessonByID } from "../course/lesson";
import { getChapterByID } from "../course/chapter";
import { getCourseById } from "../course/get";
import { getUserById } from "@/data/user";
import { prisma } from "@/lib/prisma";

export async function uploadVideoLessonToServer(formData: FormData): Promise<{ ID: string, URL: string }> {
    const videoFile = formData.get('videofile') as File;
    const lessonID = formData.get('lessonID') as string;
    const userID = formData.get('userID') as string
    
    if (!videoFile) throw new Error("Nie znaleziono pliku!");

    const MAX_FILE_SIZE_MB = 200;
    const fileSizeMB = videoFile.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
        throw new Error("Plik jest zbyt duży! Maksymalny rozmiar to 200 MB.");
    }

    const lesson = await getLessonByID(lessonID);
    if (!lesson) {
        throw new Error("Nie znaleziono lekcji!");
    }

    // Pobierz rozdział powiązany z lekcją
    const chapter = await getChapterByID(lesson.chapterId);
    if (!chapter) {
        throw new Error("Nie znaleziono rozdziału!");
    }

    // Pobierz kurs powiązany z rozdziałem
    const course = await getCourseById(chapter.courseId);
    if (!course) {
        throw new Error("Nie znaleziono kursu!");
    }

    const user = await getUserById(userID);
    if (!user) {
        throw new Error("Nie znaleziono użytkownika!")
    }

    // Sprawdź, czy kurs należy do użytkownika
    if (course.ownerId !== userID) {
        throw new Error("Nie masz uprawnień do edycji tego kursu!");
    }

    const fileServer = process.env.FILE_SERVER_URL;
    const uniqueFileName = uuidv4();
    const originalFileName = videoFile.name;
    const fullFileName = `${uniqueFileName}${path.extname(originalFileName)}`;
    const arrayBuffer = await videoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);


    //const dirPath = join('lessons', lessonID, 'video');
    const dirPath = `kurs/${course.slug}/${chapter.slug}/${lesson.slug}`
    const dataPathURL = `https://www.akademiawilka.pl/kurs/${course.slug}/${chapter.slug}/${lesson.slug}/${fullFileName}`;
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

        const existingVideo = await prisma.videoLesson.findUnique({
            where: { lessonId: lessonID },
        });

        if (existingVideo && existingVideo.url) {
            // Usuń stare wideo z serwera FTP
            const existingVideoName = existingVideo.url.split('/').pop();
            if (!existingVideoName) {
                throw new Error("Nie udało się odczytać nazwy video z URL.");
            }
            const existingFilePath = join(dirPath, existingVideoName);
            console.log("FULL FILE NAME: ", fullFileName)
            console.log("EXISTINGFILEPATH:", existingFilePath)
            await client.remove(existingFilePath);
        }

        const fileStream = Readable.from(buffer);

        await client.ensureDir(dirPath);
        await client.uploadFrom(fileStream, fullFileName);

//        const duration = await getVideoDurationFromURL(dataPath);
 
        await prisma.videoLesson.upsert({
            where: { lessonId: lessonID },
            update: {
                url: dataPath,
                name: uniqueFileName,
//                duration: duration,
                source: 'internal', // Zakładam, że to jest Twoje źródło
            },
            create: {
                lessonId: lessonID,
                url: dataPath,
                name: uniqueFileName,
//                duration: duration,
                source: 'internal', // Zakładam, że to jest Twoje źródło
            }
        });
    } catch (error) {
        throw new Error("Wystąpił błąd podczas przesyłania filmu!");
    } finally {
        client.close();
    }

    return { ID: uniqueFileName, URL: dataPath };
}

export const updateVideoDuration = async (id:string, duration:number) => {
    if (!id || !duration) {
        throw new Error("Invalid parameters!");
    }

    await prisma.videoLesson.update({
        where: { lessonId: id},
        data: {duration: duration}
    })
}
//const dirPath = join('courses',existingCourse.id,'chapters',existingChapter.id,'lessons',lessonID,'video');
//const dataPathURL = new URL(`/akademia_wilka/courses/${existingCourse.id}/chapters/${existingChapter.id}/lessons/${lessonID}/video/${fullFileName}`, fileServer)