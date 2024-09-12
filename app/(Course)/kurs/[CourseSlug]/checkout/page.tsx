"use client"

import { getCourseBySlug } from "@/actions/course/course";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Course } from "@prisma/client";
import { ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { useCurrentUser } from "@/hooks/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";

const CourseCheckoutPage = ({
    params
}:{
    params: {CourseSlug:string}
}) => {
    const [course, setCourse] = useState<Course>()
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const user = useCurrentUser()

    const fetchCourse = async () => {
        const course = await getCourseBySlug(params.CourseSlug)
        if(!course) {
            router.push("/kursy")
            return
        }
        setCourse(course)
    }

    useEffect(()=> {
        setLoading(true)
        fetchCourse()
        setLoading(false)
    },[])

    return (
        loading ? (
            <div className="w-full flex justify-center">
                <Loader2 className="animate-spin mr-[1vw]"/>
                Ładowanie...
            </div>
        ):(
            <div className="space-y-[1vh] w-full px-[1vw] py-[1vh] md:px-[20vw]">
                {course && (
                    <div className="w-full">
                        <h1>
                            Kupujesz kurs
                        </h1>
                        <Card>
                            <div className="grid grid-cols-3">
                                <div className="col-span-1">
                                    <div className="aspect-video">
                                        {course.imageUrl ? (
                                            <Image
                                                fill
                                                className="object-cover rounded-l"
                                                alt={course.title}
                                                src={course.imageUrl}
                                            />
                                        ):(
                                            <div className="bg-primary/10 flex w-full h-full items-center justify-center rounded-l">
                                                <ImageIcon className="h-[5vh] w-[5vh]"/>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-2 borde-r border-red-500">
                                    <CardHeader>
                                        <CardTitle>
                                            {course.title}
                                        </CardTitle>
                                        Cena: {formatPrice(course.price!)}
                                    </CardHeader>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
                {user ? (
                    <div>
                    </div>
                ):(
                    <Tabs defaultValue="Logowanie" className="w-full">
                        <TabsList className="grid grid-cols-2 w-full">
                            <TabsTrigger value="Logowanie">Logowanie</TabsTrigger>
                            <TabsTrigger value="Rejestracja">Rejestracja</TabsTrigger>
                        </TabsList>
                        <TabsContent value="Logowanie">
                            <div className="w-full flex justify-center">
                                <Card className="max-w-[600px] pt-[1vh]">
                                    <CardHeader/>
                                    <CardContent>
                                        <LoginForm/>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        <TabsContent value="Rejestracja">
                            <div className="w-full flex justify-center">
                                <Card className="max-w-[600px] pt-[1vh]">
                                    <CardContent>
                                        <RegisterForm/>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        )
    );
}
 
export default CourseCheckoutPage;