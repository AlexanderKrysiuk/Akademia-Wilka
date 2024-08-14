"use server"
export const getAttachmentsByCourseId = async (id: string) => {
    const attachments = await prisma?.attachment.findMany({
        where: { courseId : id}
    })
    return attachments
}