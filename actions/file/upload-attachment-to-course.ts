"use server"
import { getUserById } from "@/data/user";
import { getCourseById } from "@/actions/course/get";
import { v4 as uuidv4 } from "uuid";
import path, {join} from "path";
import { Readable } from "stream";
import { prisma } from "@/lib/prisma"; // Zakładając, że używasz Prisma
import * as ftp from "basic-ftp";


export async function uploadAttachmentToCourse(formData: FormData) {
    const file: File | null = formData.get('file') as File;
    const courseId: string = formData.get('courseId') as string;
    const userId: string = formData.get('userId') as string;

    if (!file) {
        return { success: false, message: "Nie udało się odczytać pliku!" };
    }

    const user = await getUserById(userId);
    if (!user) {
        return { success: false, message: "Nie znaleziono użytkownika!" };
    }

    if (!user.role?.teacher) {
        return { success: false, message: "Użytkownik nie ma uprawnień do edycji kursu!" };
    }

    const course = await getCourseById(courseId);
    if (!course) {
        return { success: false, message: "Nie znaleziono kursu!" };
    }

    if (course.ownerId !== user.id) {
        return { success: false, message: "Użytkownik nie jest twórcą kursu!" }
    }

    const fileServer = process.env.FILE_SERVER_URL;
    const uniqueFileName = uuidv4(); // Unikalna nazwa pliku
    const originalFileName = file.name; // Oryginalna nazwa pliku
    const fullFileName = `${uniqueFileName}${path.extname(originalFileName)}`; // Zachowaj rozszerzenie oryginalnego pliku

    const dirPath = join('courses', courseId, 'attachments');
    const dataPathURL = new URL(`/akademia_wilka/courses/${courseId}/attachments/${fullFileName}`, fileServer);
    const dataPath = dataPathURL.toString();

    const client = new ftp.Client();
    client.ftp.verbose = true;

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
        await client.uploadFrom(fileStream, fullFileName);

        // Tworzenie załącznika w bazie danych
        await prisma.attachment.create({
            data: {
                name: originalFileName, // Przechowuj oryginalną nazwę pliku
                url: dataPath, // URL do pliku
                courseId: courseId, // ID kursu, do którego przypisany jest załącznik
            }
        });

    } catch (error) {
        return { success: false, message: "Wystąpił błąd podczas przesyłania załącznika." };
    } finally {
        client.close();
    }

    return { success: true, message: "Załącznik został dodany!" };
}
