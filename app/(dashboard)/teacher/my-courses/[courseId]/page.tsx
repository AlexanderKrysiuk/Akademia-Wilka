"use client"
import { useCurrentUser } from "@/hooks/user";
import { Course, Chapter, Category, UserRole, Level } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { Settings } from 'lucide-react';
import { GetMyCreatedCourse, unpublishCourse } from "@/actions/course-teacher/course";
import PageLoader from "@/components/page-loader";
import { Button, Card, CardBody, CardFooter, CardHeader, Progress } from "@nextui-org/react";
import TitleCard from "@/components/Course-Create/Course/title-card";
import SlugCard from "@/components/Course-Create/Course/slug-card";
import ImageCard from "@/components/Course-Create/Course/image-card";
import { toast } from "react-toastify";
import PublishButton from "@/components/Course-Create/Course/publish-button";
import CategoryCard from "@/components/Course-Create/Course/category-card";
import LevelCard from "@/components/Course-Create/Course/level-card";
import PriceCard from "@/components/Course-Create/Course/price-card";
import { GetChaptersByCourseId } from "@/actions/chapter-teacher/chapter";
import ChapterList from "@/components/Course-Create/Chapter/chapter-list";
import SubjectCard from "@/components/Course-Create/Course/subject-card";


const CourseIdPage = ({
    params
} : {
    params: { courseId: string }
}) => {
    const user = useCurrentUser();        
    const [course, setCourse] = useState<Course | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    
    const requiredFields = useMemo(() => (
        course ? [
            course.title,
            course.slug,
            course.imageUrl,
            course.category,
            course.level,
            course.subject,
            chapters.some(chapter => chapter.published)
        ] : []
    ), [course, chapters]);
    const completedFields = requiredFields.filter(Boolean).length;

    const fetchCourseData = useCallback(async () => {
        if(!user) return

        //setLoading(true)
        try {
            const [fetchedCourse, fetchedChapters] = await Promise.all([
                GetMyCreatedCourse(user.id, params.courseId),
                GetChaptersByCourseId(params.courseId),
            ])
            if (fetchedCourse.ownerId !== user.id && !user.role.includes(UserRole.Admin)) {
                return
            }
            if (completedFields < requiredFields.length && fetchedCourse.published) {
                await unpublishCourse(fetchedCourse.id)
                toast.warning(
                    "Kurs zmienił status na: szkic. Uzupełnij wszystkie pola, by go opublikować."
                );
            }
                setCourse(fetchedCourse)
                setChapters(fetchedChapters)
        } catch(error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false)
        }
    }, [user, params.courseId, completedFields, requiredFields])

    useEffect(()=>{
        if (loading) fetchCourseData()
    }, [loading, fetchCourseData])

    if (loading) {
        return <PageLoader/>
    }

    if (!course || !user) {
        return <div> Brak danych o kursie </div>
    }

    return (
        <main className="w-full">
            <Card className="mb-4">
                <CardHeader className="w-full justify-between">
                    <div className="flex">
                        <Settings/>
                        {course.title}
                    </div>
                    <div>
                        <PublishButton
                            courseId={course.id}
                            published={course.published}
                            onUpdate={fetchCourseData}
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
                        color={completedFields / requiredFields.length === 1 ? "success" : "warning"} 
                    />
                </CardBody>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <TitleCard
                        courseId={course.id}
                        title={course.title}
                        onUpdate={fetchCourseData}
                    />
                    <SlugCard
                        courseId={course.id}
                        slug={course.slug}
                        onUpdate={fetchCourseData}
                    />
                    <ImageCard
                        courseId={course.id}
                        imageUrl={course.imageUrl}
                        onUpdate={fetchCourseData}
                    />
                    <CategoryCard
                        courseId={course.id}
                        userId={user.id}
                        category={course.category}
                        onUpdate={fetchCourseData}
                    />
                    <LevelCard
                        courseId={course.id}
                        userId={user.id}
                        level={course.level}
                        onUpdate={fetchCourseData}
                    />
                    <SubjectCard
                        courseId={course.id}
                        userId={user.id}
                        subject={course.subject}
                        onUpdate={fetchCourseData}
                    />
                    <PriceCard
                        courseId={course.id}
                        price={course.price}
                        onUpdate={fetchCourseData}
                    />
                </div>
                <div>
                    <ChapterList
                        courseId={course.id}
                        chapters={chapters}
                        onUpdate={fetchCourseData}
                    />
                </div>
            </div>
        </main>
    )
};
export default CourseIdPage;