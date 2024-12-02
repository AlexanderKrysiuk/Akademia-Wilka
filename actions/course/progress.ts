import { prisma } from "@/lib/prisma"
import { LessonType } from "@prisma/client";

export const getCompletedLessonsCountByCourseID = async (courseID:string, userID:string) => {
    //return await prisma.userProgress.count({
    //    where: {
    //        userId: userID,
    //        lesson: {
    //            chapter: {
    //                courseId: courseID,
    //                published: true
    //            },
    //            published: true,
    //            type: {
    //                not: LessonType.Subchapter
    //            }
    //        },
    //        completed: true
    //    }
    //})
}

export const getCompletedLessonsByChapterID = async (chapterID:string, userID:string) => {
    return await prisma.userProgress.findMany({
        where: {
            userId: userID,
            completed: true,
            lesson: {
                chapterId: chapterID
            }
        },
        select: {
            lessonId: true
        }
    })
}

// actions/course/progress.ts


export const getCompletedLessonsByCourseIDAndUserID = async (courseID: string, userID: string) => {
    return await prisma.userProgress.findMany({
        where: {
            lesson: {
                chapter: {
                    courseId: courseID
                }
            },
            userId: userID,
            completed: true
        },
        select: {
            lessonId: true
        }
    });
};



export const getCompletedLessonsByCourseID = async (courseID: string, userID: string) => {
    // Pobranie ukończonych lekcji z dodatkowymi informacjami
    const completedLessons = await prisma.userProgress.findMany({
        where: {
            userId: userID,
            lesson: {
                chapter: {
                    courseId: courseID
                }
            },
            completed: true
        },
        select: {
            lessonId: true,
            lesson: {
                select: {
                    chapterId: true
                }
            }
        }
    });

    // Grupowanie ukończonych lekcji według chapterId
    const completedLessonsByChapter = completedLessons.reduce((acc, userProgress) => {
        const chapterId = userProgress.lesson.chapterId;
        if (!acc[chapterId]) {
            acc[chapterId] = new Set<string>();
        }
        acc[chapterId].add(userProgress.lessonId);
        return acc;
    }, {} as Record<string, Set<string>>);

    return completedLessonsByChapter;
}



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

            //const completedLessons = await prisma.userProgress.count({
            //    where: {
            //        userId: userID,
            //        lessonId: {
            //            in: publishedLessonsIDs
            //        },
            //        completed: true
            //    }
            //})

            //const progressPercentage = (completedLessons / publishedLessonsIDs.length) * 100;

            //return progressPercentage;
            return 0;
        } catch (error) {
            return 0;
        }


}