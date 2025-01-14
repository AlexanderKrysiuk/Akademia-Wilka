"use client"

import { Button, Divider } from "@nextui-org/react";
import { Lesson } from "@prisma/client";
import { VideoOff } from "lucide-react";

const LessonDisplay = ({
    lesson
} : {
    lesson: Lesson
}) => {
    const media = lesson.media ? JSON.parse(lesson.media as string) : []

    return (
        <main>
            {media.length > 0 && media[0].url ? (
                <video controls controlsList="nodownload">
                    <source src={media[0].url} type="video/mp4"/>
                </video>
            ) : (
                <div className="w-full h-auto aspect-video bg-primary/10 flex justify-center items-center flex-col">
                    <VideoOff className="w-10 h-auto" />
                    Brak Video
                </div>
            )}            
            <Divider/>
            <div className="gap-4 w-full flex justify-center items-center py-4" >
                <Button
                    size="sm"
                    color="primary"
                    className="text-white"
                >
                    Poprzednia lekcja
                </Button>
                <Button
                    size="sm"
                    color="primary"
                    className="text-white"
                >
                    Ukończ lekcję
                </Button>
                <Button
                    size="sm"
                    color="primary"
                    className="text-white"
                >
                    Następna lekcja
                </Button>
            </div>
            {/*JSON.stringify(lesson,null,2)*/}
        </main>
    );
}
 
export default LessonDisplay;