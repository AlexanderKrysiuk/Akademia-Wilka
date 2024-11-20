"use client"

import { unpublishChapter } from "@/actions/chapter-teacher/chapter";
import { GetLessonsByChapterId } from "@/actions/lesson-teacher/lesson";
import PageLoader from "@/components/page-loader";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chapter, Lesson } from "@prisma/client";
import { ChevronUp, Eye, EyeOff, Scroll } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ChapterEditModal from "./chapter-edit-modal";
import ChapterDeleteModal from "./chapter-delete-modal";
import LessonsList from "../Lesson/lessons-list";
import { motion } from "framer-motion";

const ChapterCard = ({
    chapter,
    dragHandleProps,
    onUpdate
}:{
    chapter: Chapter
    dragHandleProps: DraggableProvidedDragHandleProps | null
    onUpdate: () => void
}) => {
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(false)

    const requiredFields = [
        chapter.title,
        chapter.slug,
        lessons.some(lesson => lesson.published)
    ]
    const completedFields = requiredFields.filter(Boolean).length

    async function fetchLessons() {
        const fetchedLessons = await GetLessonsByChapterId(chapter.id)
        setLessons(fetchedLessons)
    }

    useEffect(()=>{
        if (completedFields < requiredFields.length && chapter.published) {
            unpublishChapter(chapter.id)
            toast.warning("Rozdział zmienił status na:szkic, uzupełnij wszystkie pola by go opublikować")
        }
        fetchLessons()
        setLoading(false)
    },[chapter.id])

    if (loading) return <PageLoader/>

    return ( 
        <Card>
            <CardHeader className="gap-x-2">
                <div {...dragHandleProps}>
                    <Scroll className="hover:text-primary transition duration-300"/>
                </div>
                <div className="truncate w-full">
                    {chapter.title}
                </div>
                <div className="text-sm">
                    {chapter.published ? (
                        <Eye/>
                    ) : (
                        <EyeOff/>
                    )}
                </div>
                <ChapterEditModal
                    chapter={chapter}
                    requiredFields={requiredFields}
                    lessons={lessons}
                    onUpdate={fetchLessons}
                    onLessonUpdate={fetchLessons}
                />
                <ChapterDeleteModal
                    chapter={chapter}
                    onUpdate={onUpdate}
                />
                {/*
                <motion.div
                    animate={{ rotate : expanded ? 0 : -180 }}
                    transition={{ duration: 0.3 }}
                    className="hover:text-primary transtition duration-300 cursor-pointer"
                    onClick={()=>{
                        setExpanded((prev)=>!prev)
                    }}
                >
                    <ChevronUp/>
                </motion.div>
                */}
            </CardHeader>
            {/*
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
                transition={{ duration : 0.5 }}
                style={{ overflow: 'hidden' }}
            >
                <CardBody>
                    {JSON.stringify(lessons,null,2)}
                    <LessonsList
                        chapter={chapter}
                        lessons={lessons}
                        onUpdate={fetchLessons}
                        />
                </CardBody>
            </motion.div>
            */}
        </Card>
     );
}
 
export default ChapterCard;