"use client"

import { getPublishedCourses } from "@/actions/student/course";
import PageLoader from "@/components/page-loader";
import { Button, Card, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { Course } from "@prisma/client";
import { EyeIcon, Gift, ShoppingBasket, ShoppingCart, ShoppingCartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CoursesPage = () => {
    const [courses, setCourses] = useState<Course[]>([])
    const router = useRouter();
    
    useEffect(()=>{
        getPublishedCourses()
            .then((data)=>setCourses(data))
            .catch((error)=>{
                toast.error(error)
            })
    }, [])

    if (!courses.length) return <PageLoader/>

    return (
        <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {courses.map((course) => (
                    <Card
                        isPressable
                        isHoverable
                        key={course.id} 
                        className="mb-4 group transition-all duration-500 hover:border-1 hover:border-primary"
                        style={{ overflow: "hidden" }}
                        onPress={() => router.push(`/kursy/${course.slug}`)} // Nawigacja po kliknięciu
                    >
                        <Image
                            src={course.imageUrl!}
                            alt={course.title}
                            className="rounded-b-none transition-transform duration-300 "
                        />
                        <CardHeader
                            className="flex justify-between p-4 transition-all duration-300"
                        >
                            <h3
                                className="text-lg font-medium transition-colors duration-300 group-hover:text-primary"
                                >
                                {course.title}
                            </h3>
                            {/*
                            <Button
                                size="sm"
                                isIconOnly
                                variant="light"
                            >
                                <EyeIcon/>
                            </Button>
                */}
                        </CardHeader>
                        <p>{course.description}</p>
                        <CardFooter className="gap-4">
                            {/*
                            <Button
                                size="sm"
                                color="primary"
                                fullWidth
                            >
                                kup kurs <ShoppingCart/>
                            </Button>
                            <Button
                                size="sm"
                                color="primary"
                                isIconOnly
                            >
                                <ShoppingCart/>
                            </Button>
                            <Button
                                size="sm"
                                color="primary"
                                variant="faded"
                                isIconOnly
                            >
                                <Gift/>
                            </Button>
                */}
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <pre>
                {/*JSON.stringify(courses,null,2)*/}
            </pre>
        </main>
    );
}
 
export default CoursesPage;