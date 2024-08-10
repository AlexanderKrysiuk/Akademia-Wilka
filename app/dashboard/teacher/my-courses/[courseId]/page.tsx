"use client"
import { getCourseById } from "@/actions/course/get";
import { useCurrentUser } from "@/hooks/user";
import { Course } from "@prisma/client";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CourseIdPage = ({
    params
} : {
    params: { courseId: string}
}) => {
    const [course, setCourse] = useState<Course>()
    const router = useRouter()
    const user = useCurrentUser();

    useEffect(() => {
        const fetchCourse = async () => {
            const course = await getCourseById(params.courseId)
            if(!course){
                return
            }
            setCourse(course)
        };
        fetchCourse()
    },[])

    useEffect(() => {
        if (course && user) {
            if (course.ownerId !== user.id) {
                router.push("/"); // Przekierowanie, jeśli użytkownik nie jest właścicielem kursu
            }
        }
    }, [course, user, router]); // Używaj 'course' i 'user' jako zależności

    // Dodaj warunek, aby pokazać loadera, gdy kurs się ładuje
    if (!course) {
        return <div>Ładowanie</div>; // Komunikat o ładowaniu
    }
    

    {/*    
    if (!user) {
        redirect("/");
    }
    if (user?.id !== course?.ownerId) {
        redirect("/");
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ]

    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const completionText = `(${completedFields} / ${totalFields})`
    */}
    return (  
        <div>
            Course Id: {course.id}
            Course Title: {course.title}
        </div>
     );
}
 
export default CourseIdPage;