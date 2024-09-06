import { prisma } from "@/lib/prisma"
import { LessonType } from "@prisma/client";

export const getProgress = async (
    userID: string, 
    courseID: string): Promise<number> => {
        try {
            const publishedLessons = await prisma.lesson.findMany({
                where: {
                    chapter: {
                        published: true,
                        courseId: courseID
                    },
                    published: true,
                    type: { not: LessonType.Subchapter }
                },
                select: {
                    id: true
                }
            })
            const publishedLessonsIDs = publishedLessons.map((lesson) => lesson.id)

            const completedLessons = await prisma.userProgress.count({
                where: {
                    userId: userID,
                    lessonId: {
                        in: publishedLessonsIDs
                    },
                    completed: true
                }
            })

            const progressPercentage = (completedLessons / publishedLessonsIDs.length) * 100;

            return progressPercentage;

        } catch (error) {
            return 0;
        }


}