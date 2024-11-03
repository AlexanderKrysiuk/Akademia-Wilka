"use client"

import { Button, Card, CardHeader } from "@nextui-org/react";
import { Chapter } from "@prisma/client";
import { SquarePlus } from "lucide-react";
import CreateChapterModal from "./create-chapter-modal";

const ChapterCard = ({
    courseId,
    chapters,
    onUpdate,
    onChapterCreate
} : {
    courseId: string,
    chapters: Chapter[],
    onUpdate: () => void,
    onChapterCreate: () => void
}) => {
    return (
        <Card>
            <CardHeader className="flex w-full justify-between">
                <div>Rozdziały kursu</div>
                <CreateChapterModal
                    courseId={courseId}
                    onUpdate={onChapterCreate}
                />
            </CardHeader>
            {JSON.stringify(chapters, null,2)}
        </Card>
    );
}
 
export default ChapterCard;