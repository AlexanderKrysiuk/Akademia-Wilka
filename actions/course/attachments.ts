"use server"

import * as ftp from "basic-ftp";
import { join } from "path";

export const getAttachmentsByCourseID = async (ID: string) => {
    const attachments = await prisma?.attachment.findMany({
        where: { courseId : ID}
    })
    return attachments
}

export const getAttachmentByID = async (ID:string) => {
    const attachment = await prisma?.attachment.findUnique({
        where: {id: ID}
    })
    return attachment
}

export const deleteAttachmentByID = async (ID: string) => {
    const attachment = await getAttachmentByID(ID)
    if (!attachment) {
        return { success: false, message: "Nie znaleziono załącznika!"}
    }

    if (!attachment.courseId) {
        return { success: false, message: "Załącznik musi mieć ID kursu!"} 
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
    console.log("FILEPATH: ",filePath)

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
            where: {id: ID}
        })
    } catch(error) {
        return { success: false, message: "Nie udało się usunąć załącznika!" }
    } finally {
        client.close()
    }

    return { success: true, message: "Usunięto załącznik"}
}