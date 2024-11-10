"use client"

import { GetChapterById, unpublishChapter } from "@/actions/chapter-teacher/chapter";
import { GetLessonsByChapterId } from "@/actions/lesson-teacher/lesson";
import PublishChapterButton from "@/components/Course-Create/Chapter/chapter-publish-button";
import ChapterSlugCard from "@/components/Course-Create/Chapter/chapter-slug-card";
import ChapterTitleCard from "@/components/Course-Create/Chapter/chapter-title-card";
import DeleteChapterModal from "@/components/Course-Create/Chapter/delete-chapter-modal";
import LessonsCard from "@/components/Course-Create/Chapter/lessons-card";
import PageLoader from "@/components/page-loader";
import { useCurrentUser } from "@/hooks/user";
import { Button, Card, CardBody, CardHeader, Progress } from "@nextui-org/react";
import { Chapter, Lesson } from "@prisma/client";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ChapterIdPage = ({
    params
} : {
    params: {courseId:string, chapterId:string}
}) => {
    
    const user = useCurrentUser()
    const router = useRouter()

    const [chapter, setChapter] = useState<Chapter>()
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [loading, setLoading] = useState(true)

    const requiredFields = chapter ? [
        chapter.title,
        chapter.slug,
        lessons.some(lesson => lesson.published)
    ] : []
    const completedFields = requiredFields.filter(Boolean).length;

    async function fetchChapter() {
        const fetchedChapter = await GetChapterById(params.chapterId)
        if (fetchedChapter?.courseId !== params.courseId) return
        setChapter(fetchedChapter)
    }

    async function fetchLessons() {
        const fetchedLessons = await GetLessonsByChapterId(params.chapterId)
        setLessons(fetchedLessons)
    }

    useEffect(()=>{
        fetchChapter()
        if (completedFields < requiredFields.length && chapter?.published) {
            unpublishChapter(chapter.id)
            toast.warning("Rozdział zmienił status na:szkic, uzupełnij wszystkie pola by go opublikować")
        }
        fetchLessons()
        setLoading(false)
    },[user, params])

    if (loading) return <PageLoader/>

    return (
        chapter ?
        <main>
            <Link href={`./`} className="flex gap-2 hover:text-primary transition duration-300">
                <LogOut/> Powrót
            </Link>
            <Card className="my-2">
                <CardHeader className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        <Settings/>
                        <span>Rozdział: {chapter.title}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <DeleteChapterModal
                            chapter={chapter}
                            courseId={params.courseId}
                            onUpdate={()=>{router.push("./")}}
                        />
                        <PublishChapterButton
                            chapterId={chapter.id}
                            published={chapter.published}
                            onUpdate={fetchChapter}
                            completedFields={completedFields}
                            requiredFields={requiredFields.length}
                        />
                    </div>
                </CardHeader>
                <CardBody>
                    <Progress
                        label={`(${completedFields}/${requiredFields.length})`}
                        value={completedFields / requiredFields.length * 100}
                        showValueLabel={true}
                        color={completedFields / requiredFields.length === 1 ? "success" : "warning" }
                    />
                </CardBody>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-[1vh]">
                    <ChapterTitleCard
                        chapterId={chapter.id}
                        title={chapter.title}
                        onUpdate={fetchChapter}
                    />
                    <ChapterSlugCard
                        courseId={chapter.courseId}
                        chapterId={chapter.id}
                        slug={chapter.slug}
                        onUpdate={fetchChapter}
                    />
                </div>
                <div className="space-y-[1vh]">
                    <LessonsCard
                        chapterId={chapter.id}
                        courseId={chapter.courseId}
                        lessons={lessons}
                        onUpdate={fetchLessons}
                    />
                </div>
            </div>
        </main> 
        :
        <main>
        </main>
    );
}
 
export default ChapterIdPage;