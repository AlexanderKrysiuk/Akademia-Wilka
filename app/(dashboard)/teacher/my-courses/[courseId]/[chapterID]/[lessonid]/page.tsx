"use client"

import { GetLessonById } from "@/actions/lesson-teacher/lesson";
import DeleteLessonModal from "@/components/Course-Create/Lesson/delete-lesson-modal";
import PublishLessonButton from "@/components/Course-Create/Lesson/lesson-publish-button";
import LessonTitleCard from "@/components/Course-Create/Lesson/lesson-title-card";
import PageLoader from "@/components/page-loader";
import { useCurrentUser } from "@/hooks/user";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Progress } from "@nextui-org/react";
import { Lesson, LessonType } from "@prisma/client";
import { LogOut, Router, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LessonIdPage = ({
    params
} : {
    params: {courseId:string, chapterId:string, lessonId:string}
}) => {
    const user = useCurrentUser()
    const router = useRouter()

    const [lesson, setLesson] = useState<Lesson>()
    const [loading, setLoading] = useState(true)

    const requiredFields = lesson ? [
        lesson.title,
        //...(lesson.type !== LessonType.Subchapter ? [lesson.slug] : [])
    ] : []
    const completedFields = requiredFields.filter(Boolean).length;

    async function fetchLesson() {
        const fetchedLesson = await GetLessonById(params.lessonId)
        if (fetchedLesson) setLesson(fetchedLesson)
    }

    useEffect(()=>{
        fetchLesson()
        setLoading(false)
    },[user,params])

    if (loading) return <PageLoader/>

    return (
        lesson ? 
            <main>
                <Link href={`./`} className="flex gap-2 hover:text-primary transition duration-300">
                    <LogOut/> Powrót
                </Link>
                <Card className="my-2">
                    <CardHeader className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <Settings/>
                            <span>Lekcja: {lesson.title} </span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <DeleteLessonModal
                                lesson={lesson}
                                chapterId={params.chapterId}
                                courseId={params.courseId}
                                onUpdate={()=>{router.push("./")}}
                            />
                            <PublishLessonButton
                                lessonId={lesson.id}
                                published={lesson.published}
                                onUpdate={fetchLesson}
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
                    <div className="space-y-[1h]">
                        <LessonTitleCard
                            lessonId={lesson.id}
                            title={lesson.title}
                            onUpdate={fetchLesson}
                        />
                    </div>
                </div>
            </main>
        :
        <main>

        </main>
     );
}
 
export default LessonIdPage;