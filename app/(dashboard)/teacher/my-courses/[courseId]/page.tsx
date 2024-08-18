"use client"
import { getCourseById } from "@/actions/course/get";
import { useCurrentUser } from "@/hooks/user";
import { Course, Chapter } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Settings } from 'lucide-react';
import TitleForm from "@/components/dashboard/teacher/courses/title-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DescriptionForm from "@/components/dashboard/teacher/courses/description-form";
import CategoryForm from "@/components/dashboard/teacher/courses/category-form";
import LevelForm from "@/components/dashboard/teacher/courses/level-form";
import PriceForm from "@/components/dashboard/teacher/courses/price-form";
import ChapterForm from "@/components/dashboard/teacher/courses/chapter-form";
import ImageForm from "@/components/dashboard/teacher/courses/image-form"
import AttachmentForm from "@/components/dashboard/teacher/courses/attachment-form";
import { motion } from "framer-motion";

const CourseIdPage = ({
    params
}: {
    params: { courseId: string }
}) => {
    const user = useCurrentUser();
    const router = useRouter();
    const [course, setCourse] = useState<Course>();

    if (!user) {
        router.push("/");
        return;
    }

    if (!user.id){
        router.push("/");
        return;
    }

    if (!user?.role?.teacher) {
        router.push("/");
        return;
    }

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
};
export default CourseIdPage;