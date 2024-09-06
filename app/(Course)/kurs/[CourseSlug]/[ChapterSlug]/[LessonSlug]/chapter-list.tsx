"use client";

import { useEffect, useState } from "react";
import { getPublishedChaptersByCourseID, getPublishedChaptersByCourseIDwithPublishedLessonsID } from "@/actions/course/chapter";
import { getLessonCountByChapterID } from "@/actions/course/lesson";
import { getCompletedLessonsByCourseID } from "@/actions/course/progress";
import { useCurrentUser } from "@/hooks/user";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ChevronDown, Loader2 } from "lucide-react";
import LessonList from "./lesson-list";
import { Chapter } from "@prisma/client";

interface ChapterListProps {
    course: {
        id: string;
        slug: string;
    };
}

const ChapterList = ({ course }: ChapterListProps) => {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
    const [lessonCounts, setLessonCounts] = useState<Record<string, number>>({});
    const [completedLessonsByChapter, setCompletedLessonsByChapter] = useState<Record<string, Set<string>>>({});

    const fetchChapters = async () => {
        setLoading(true);
        const chapters = await getPublishedChaptersByCourseID(course.id);
        setChapters(chapters);
        setLoading(false);
    };




    useEffect(() => {

        fetchChapters();
    },[]);

    const toggleExpandChapter = (chapterID: string) => {
        setExpandedChapters(prev =>
            prev.includes(chapterID) ? prev.filter(id => id !== chapterID) : [...prev, chapterID]
        );
    };

    const handleLessonsCount = (chapterID: string, count: number) => {
        setLessonCounts(prev => ({
            ...prev,
            [chapterID]: count
        }));
    };

    return (
        <div>
            {loading ? (
                <div className="flex items-center justify-center py-[1vh] px-[1vw]">
                    <Loader2 className="animate-spin mr-2" />
                    Ładowanie...
                </div>
            ) : (
                chapters.length > 0 ? (
                    chapters.map((chapter) => (
                        <div key={chapter.id}>
                            <Card className="flex items-center justify-between px-[1vw] py-[1vh] bg-foreground/5 border-x-0 rounded-none space-x-[1vw]">
                                <div className={`w-full ${expandedChapters.includes(chapter.id)
                                    ? "text-primary"
                                    : "text-foreground"
                                }`}>
                                    {chapter.title}
                                </div>    
                                <div className="text-foreground/50">
                                    {lessonCounts[chapter.id] || 0}
                                </div>
                                <ChevronDown
                                    onClick={() => toggleExpandChapter(chapter.id)}
                                    className={`cursor-pointer transition-transform duration-500 transform ${
                                        expandedChapters.includes(chapter.id)
                                            ? "rotate-180 text-primary"
                                            : "rotate-0 text-foreground"
                                    }`}
                                />
                            </Card>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: expandedChapters.includes(chapter.id) ? "auto" : 0, opacity: expandedChapters.includes(chapter.id) ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div className="mb-[1vh]">
                                    <LessonList
                                        course={course}
                                        chapter={chapter}
                                        onLessonsCount={(count) => handleLessonsCount(chapter.id, count)} // Przekaż callback

                                        //completedLessons={user ? completedLessonsByChapter[chapter.id] || new Set() : new Set()}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-start py-[1vh] px-[1vw]">
                        Brak rozdziałów do wyświetlenia...
                    </div>
                )
            )}
        </div>
    );
};

export default ChapterList;
