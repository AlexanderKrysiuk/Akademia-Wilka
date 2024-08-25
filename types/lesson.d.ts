import { Lesson, VideoLesson } from '@prisma/client';

export interface ExtendedLesson extends Lesson {
    video: VideoLesson | null;
}