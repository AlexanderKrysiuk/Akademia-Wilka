import * as z from 'zod'
import { LessonType, VideoSource } from "@prisma/client";

const titleTemplate = z.string()
    .min(1, { message: "Podaj poprawny tytuł!" })

export const CreateLessonSchema = z.object({
    title: titleTemplate,
    //content: z.string().optional(),
    //videoSource: z.nativeEnum(VideoSource).optional(),
    //videoUrl: z.string().url().optional(),
    //videoFile: z.any().optional(),
    lessonType: z.nativeEnum(LessonType, { message: 'Typ lekcji jest wymagany' }),
    //audioUrl: z.string().url().optional()
})
{/*
.refine(data => {
    // Walidacja dla lekcji tekstowej
    if (data.lessonType === LessonType.Text && !data.content) {
        return false;
    }

    // Walidacja dla lekcji wideo
    if (data.lessonType === LessonType.Video) {
        if (!data.videoSource) {
            return false;
        }
        if (!data.videoUrl) {
            return false;
        }
    }

    // Walidacja dla lekcji audio
    if (data.lessonType === LessonType.Audio && !data.audioUrl) {
        return false;
    }

    return true;
}, {
    message: 'Uzupełnij wszystkie wymagane pola dla wybranego typu lekcji.'
});
*/}