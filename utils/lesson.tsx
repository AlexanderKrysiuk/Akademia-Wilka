import { Lesson, LessonType } from "@prisma/client"

export const isLessonPublishable = (lesson: Lesson) => {
    const {title, slug, type, media} = lesson

    // Tytuł jest wymagany
    if (!title) return false;

    // Slug jest wymagany dla lekcji, które nie są Subchapter
    if (type !== LessonType.Subchapter && !slug) return false;

    // Lekcje Video muszą mieć przypisane media
    if (type === LessonType.Video && (!Array.isArray(media) || media.length === 0)) return false;

    return true;
}