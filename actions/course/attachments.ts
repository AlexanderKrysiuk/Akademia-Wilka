"use server"

import * as ftp from "basic-ftp";
import { join } from "path";

export const getAttachmentsByCourseId = async (id: string) => {
    const attachments = await prisma?.attachment.findMany({
        where: { courseId : id}
    })
    return attachments
}

export const getAttachmentById = async (id:string) => {
    const attachment = await prisma?.attachment.findUnique({
        where: {id: id}
    })
    return attachment
}

export const deleteAttachmentByID = async (id: string) => {
    const attachment = await getAttachmentById(id)
    if (!attachment) {
        return { success: false, message: "Nie znaleziono załącznika!"}
    }

    const fileServer = process.env.FILE_SERVER_URL

    if (!fileServer) {
        return { success: false, message: "Nie znaleziono serwera!"}
    }

    const fileName = attachment.url.split('/').pop();

    if (!fileName) {
        throw new Error("Nie udało się odczytać nazwy pliku z URL.");
    }

    const dirPath = join('courses', attachment.courseId, 'attachments');
    const filePath = join(dirPath, fileName);

    const client = new ftp.Client()
    client.ftp.verbose = true

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: false
        })

        await client.remove(filePath)

        await prisma?.attachment.delete({
            where: {id: id}
        })
    } catch(error) {
        return { success: false, message: "Nie udało się usunąć załącznika!" }
    } finally {
        client.close()
    }

    return { success: true, message: "Usunięto załącznik"}
}