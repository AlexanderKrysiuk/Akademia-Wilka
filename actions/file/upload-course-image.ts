"use server"
import { getUserById } from "@/data/user";
import { v4 as uuidv4 } from 'uuid';
import { join } from "path";
import * as ftp from "basic-ftp";
import { Readable } from "stream";
import { getCourseById } from "../course/get";
import { prisma } from "@/lib/prisma"; // Zakładając, że używasz Prisma
import { isTeacher } from "@/lib/permissions";

export async function uploadCourseImage(formData: FormData) {
    const file: File | null = formData.get('image') as unknown as File;
    const courseId: string = formData.get('courseId') as string;
    const userId: string = formData.get('userId') as string;

    if (!file) {
        throw new Error("Nie udało się odczytać pliku!");
    }

    const user = await getUserById(userId);
    if (!user) {
        throw new Error("Nie znaleziono użytkownika!");
    }

    if (!isTeacher(user)) {
        throw new Error("Użytkownik nie ma uprawnień do edycji kursu!");
    }

    const course = await getCourseById(courseId);
    if (!course) {
        throw new Error("Nie znaleziono kursu!");
    }

    if (course.ownerId !== user.id) {
        throw new Error("Użytkownik nie jest twórcą kursu!");
    }

    const domain = process.env.NEXT_PUBLIC_APP_URL;
    const fileServer = process.env.FILE_SERVER_URL;
    const fileName = uuidv4();
    const fullFileName = `${fileName}.png`;

    const dirPath = join('kurs', courseId, 'obrazek');
    const dataPathURL = new URL(`/akademia_wilka/kurs/${courseId}/obrazek/${fullFileName}`, fileServer);
    const dataPath = dataPathURL.toString();

    const client = new ftp.Client();
    client.ftp.verbose = true;

    console.log("DIR PATH: ", dirPath)
    console.log("FULL FILE NAME: ", fullFileName)
    console.log("DATAPATH: ", dataPath)

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false,
        });

        const arrayBuffer = await file.arrayBuffer();
        const fileStream = Readable.from(Buffer.from(arrayBuffer));

        await client.ensureDir(dirPath);
        await client.remove(`${dirPath}/${fileName}`);
        await client.uploadFrom(fileStream, fullFileName);

        if (course.imageUrl) {
            const existingImageName = course.imageUrl.split('/').pop();
            if (existingImageName) { // Sprawdzenie, czy istnieje
                const oldFileName = existingImageName.split('.')[0];
                const fullOldFileName = `${oldFileName}.png`;
                await client.remove(fullOldFileName);
            }
        }

        await prisma.course.update({
            where: { id: course.id },
            data: { imageUrl: dataPath }
        });

    } catch (error) {
        console.error("Błąd podczas przesyłania obrazu kursu:", error);
        throw new Error("Wystąpił błąd podczas przesyłania obrazu kursu.");
    } finally {
        client.close();
    }

    return { success: true, message: "Obraz kursu zmieniony!" };
}
