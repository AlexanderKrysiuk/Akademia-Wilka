"use client"
import { getCourseById } from "@/actions/course/get";
import { useCurrentUser } from "@/hooks/user";
import { Course, Chapter } from "@prisma/client";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState, useTransition } from "react";
import { Settings } from 'lucide-react';
import TitleForm from "@/components/dashboard/teacher/courses/title-form";
import DescriptionForm from "@/components/dashboard/teacher/courses/description-form";
import CategoryForm from "@/components/dashboard/teacher/courses/category-form";
import LevelForm from "@/components/dashboard/teacher/courses/level-form";
import PriceForm from "@/components/dashboard/teacher/courses/price-form";
import ChapterForm from "@/components/dashboard/teacher/courses/chapter-form";
import ImageForm from "@/components/dashboard/teacher/courses/image-form"
import AttachmentForm from "@/components/dashboard/teacher/courses/attachment-form";
import { motion } from "framer-motion";
import { CourseSlugForm } from "@/components/dashboard/teacher/courses/course-slug-form";
import { GetMyCreatedCourse, publishCourse, unpublishCourse } from "@/actions/course-teacher/course";
import PageLoader from "@/components/page-loader";
import { Button, Card, CardBody, CardFooter, CardHeader, Progress } from "@nextui-org/react";
import TitleCard from "@/components/Course-Create/Course/title-card";
import SlugCard from "@/components/Course-Create/Course/slug-card";
import ImageCard from "@/components/Course-Create/Course/image-card";
import { toast } from "react-toastify";
import PublishButton from "@/components/Course-Create/Course/publish-button";

const CourseIdPage = ({
    params
}: {
    params: { courseId: string }
}) => {
    const user = useCurrentUser()
    
    const [course, setCourse] = useState<Course>()
    const [loading, setLoading] = useState(true)
    const [courseCreationProgress, setCourseCreationProgress] = useState(0)
    const [pending, startTransition] = useTransition()
    
    const requiredFields = course ? [
        course.title,
        course.slug,
        course.imageUrl,
    ] : []
    const completedFields = requiredFields.filter(Boolean).length;

    async function fetchMyCreatedCourse() {
        try {
            if (!user) return
            const fetchedCourse = await GetMyCreatedCourse(user.id, params.courseId)
            if (!fetchedCourse) return
            if (completedFields < requiredFields.length && fetchedCourse.published) {
                await unpublishCourse(fetchedCourse.id)
                toast.warning("Kurs zmienił status na:szkic, uzupełnij wszystkie pola by go opublikować")
            }            
            setCourse(fetchedCourse)
            //const courseValid = checkCourseRequireMents(fetchedCourse)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchMyCreatedCourse()
    },[params])

    if (loading || !course) {
        return <PageLoader/>
    }
    
    return (
        <main>
            <Card className="mb-[4vh]">
                <CardHeader className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        <Settings/>
                        <h6>{course.title}</h6>
                    </div>
                    <div>
                        <PublishButton
                            courseId={course.id}
                            published={course.published}
                            onUpdate={fetchMyCreatedCourse}
                            completedFields={completedFields}
                            requiredFields={requiredFields.length}
                        />
                    </div>
                </CardHeader>
                <CardBody>
                    <Progress
                        label={`(${completedFields}/${requiredFields.length})`}
                        value={completedFields/requiredFields.length*100}
                        showValueLabel={true}
                        color={completedFields/requiredFields.length===1 ? "success" : "warning"}
                    />
                </CardBody>
                <CardFooter>
                </CardFooter>
            </Card>
            <div className="space-y-[1vh] w-1/2">
                <TitleCard
                    courseId={course.id}
                    title={course.title}
                    onUpdate={fetchMyCreatedCourse}
                />
                <SlugCard
                    courseId={course.id}
                    slug={course.slug}
                    onUpdate={fetchMyCreatedCourse}
                />
                <ImageCard 
                    courseId={course.id} 
                    imageUrl={course.imageUrl} 
                    onUpdate={fetchMyCreatedCourse}                         
                />
            </div>
            {JSON.stringify(course,null,2)}
        </main>
    )

    {/* 
    const user = useCurrentUser();
    const router = useRouter();
    const [course, setCourse] = useState<Course>();



    const fetchCourse = async () => {
        const course = await getCourseById(params.courseId);
        if (!course) {
            router.push("/");
            return;
        }
        setCourse(course);
    };

    useEffect(() => {
        fetchCourse();
    }, []);

    useEffect(() => {
        if (course && user) {
            if (course.ownerId !== user.id) {
                router.push("/");
            }
        }
    }, [course, user, router]);

    if (!course) {
        return <div>Ładowanie</div>;
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.categoryId,
        course.levelId
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    return (
        <div className="w-full px-[1vw] py-[1vh] space-y-[1vh] mb-[10vh]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                <Card className="py-[1vh] px-[1vw] w-full">
                    <CardHeader>
                        <CardTitle>
                            <h1 className="flex gap-x-[1vw]"><Settings /> Ustawienia Kursu {completionText}</h1>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Uzupełnij wszystkie wymagane pola {completionText}
                    </CardContent>
                </Card>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[1vw] gap-y-[1vh]">
                <div className="space-y-[1vh]">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                        <TitleForm
                            course={course}
                            userID={user.id}
                            onUpdate={() => {
                                fetchCourse();
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                        <CourseSlugForm
                            course={course}
                            userID={user.id}
                            onUpdate={()=>{
                                fetchCourse();
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                       <DescriptionForm
                            course={course}
                            userID={user.id}
                            onUpdate={() => {
                                fetchCourse();
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                        <ImageForm
                            course={course}
                            userID={user.id}
                            onUpdate={()=>{
                                fetchCourse()
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>            
                        <CategoryForm
                            course={course}
                            userID={user.id}
                            onUpdate={() => {
                                fetchCourse()
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>   
                       <LevelForm
                            course={course}
                            userID={user.id}
                            onUpdate={() => {
                                fetchCourse()
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>    
                        <PriceForm
                            course={course}
                            userID={user.id}
                            onUpdate={() => {
                                fetchCourse()
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                        <AttachmentForm
                            course={course}
                            userID={user.id} 
                        />
                    </motion.div>
                </div>
                <div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                        <ChapterForm
                            course={course}
                            userID={user.id}
                        />
                    </motion.div>
                </div>           
            </div>
        </div>
    );
    */}

};
export default CourseIdPage;