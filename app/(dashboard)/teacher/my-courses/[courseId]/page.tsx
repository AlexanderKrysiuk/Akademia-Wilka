"use client"
import { getCourseById } from "@/actions/course/get";
import { useCurrentUser } from "@/hooks/user";
import { Course, Chapter } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { GetMyCreatedCourse } from "@/actions/course-teacher/course";
import PageLoader from "@/components/page-loader";
import { Card, CardBody, CardFooter, CardHeader, Progress } from "@nextui-org/react";
import TitleCard from "@/components/Course-Create/Course/title-card";
import SlugCard from "@/components/Course-Create/Course/slug-card";
import ImageCard from "@/components/Course-Create/Course/image-card";

const CourseIdPage = ({
    params
}: {
    params: { courseId: string }
}) => {
    const user = useCurrentUser()

    const [course, setCourse] = useState<Course>()
    const [loading, setLoading] = useState(true)
    const [courseCreationProgress, setCourseCreationProgress] = useState(0)

    const checkCourseRequireMents = (course: Course): number => {
        let totalRequirements = 0
        let fullfilledRequirements = 0

        if (!!course.title) {
            fullfilledRequirements++
        }
        totalRequirements++

        if (!!course.slug) {
            fullfilledRequirements++
        }
        totalRequirements++

        const percentage = (fullfilledRequirements/totalRequirements) * 100
        return Math.round(percentage)
    }

    async function fetchMyCreatedCourse() {
        try {
            if (!user) return
            const fetchedCourse = await GetMyCreatedCourse(user.id, params.courseId)
            if (!fetchedCourse) return
            const courseValid = checkCourseRequireMents(fetchedCourse)
            if (courseValid < 100) {
                //TODO: set course to unpublished
            }
            setCourseCreationProgress(courseValid)

            setCourse(fetchedCourse)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchMyCreatedCourse()
    },[user,params])

    if (loading) {
        return <PageLoader/>
    }

    return (
        course && (
                <main>
                    <Card className="mb-[4vh]">
                        <CardHeader className="flex items-center gap-2">
                            <Settings/>
                            <h6>{course?.title}</h6>
                        </CardHeader>
                        <CardBody>
                            <Progress
                                value={courseCreationProgress}
                                showValueLabel={true}
                                color={courseCreationProgress===100 ? "success" : "warning"}
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