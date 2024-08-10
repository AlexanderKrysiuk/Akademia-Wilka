"use client"
import { getCourseById } from "@/actions/course/get";
import { useCurrentUser } from "@/hooks/user";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Ghost, Settings } from 'lucide-react';
import TitleForm from "@/components/dashboard/teacher/courses/title-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SquarePen } from 'lucide-react';



const CourseIdPage = ({
    params
} : {
    params: { courseId: string}
}) => {
    const [course, setCourse] = useState<Course>()
    const [editTitle, setEditTitle] = useState(false); // Nowy stan do zarządzania widocznością formularza

    const router = useRouter()
    const user = useCurrentUser();

    useEffect(() => {
        const fetchCourse = async () => {
            const course = await getCourseById(params.courseId)
            if(!course){
                router.push("/")
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
        //TODO Loading Page
        return <div>Ładowanie</div>; // Komunikat o ładowaniu
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.levelId
    ]

    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const completionText = `(${completedFields}/${totalFields})`

    return (  
        <div className="border-4 border-red-500 w-full px-[1vw] py-[1vh] space-y-[1vh]">
            <Card className="py-[1vh] px-[1vw] w-full">
                <CardHeader>
                    <CardTitle>
                        <h1 className="flex"><Settings/>Ustawienia Kursu</h1>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    Uzupełnij wszystkie wymagane pola {completionText}
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[1vw] gap-y-[1vh]">
                <div>
                    <Card className="py-[1vh] px-[1vw] w-full">
                        <CardHeader>
                            <h2 className="justify-between w-full flex items-center">
                                Tytuł kursu    
                                <Button 
                                    variant={`link`} 
                                    className="gap-x-[1vw]"
                                    onClick={() => setEditTitle(prev => !prev)} // Przełączenie stanu
                                >
                                    {!editTitle && <SquarePen />} {/* Ikona pojawia się tylko, gdy `editTitle` jest false */}
                                    {editTitle ? "Anuluj" : "Edytuj"}                                
                                </Button>
                            </h2>
                        </CardHeader>
                        <CardContent>
                            {editTitle ? (
                                <TitleForm initialData={course} />  // Formularz pojawia się tylko w trybie edycji
                            ) : (
                                <h3>{course.title}</h3>  // Wyświetlanie tytułu, gdy edycja jest wyłączona
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

     );
}
 
export default CourseIdPage;