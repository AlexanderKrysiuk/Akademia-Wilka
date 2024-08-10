"use client"
import CreateCourseForm from "@/components/dashboard/teacher/courses/create-course-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkIfTeacherRedirect } from "@/hooks/user";

const CreateCoursePage = () => {
    checkIfTeacherRedirect

    return ( 
        <div className="my-[10vh] mx-[10vw] justify-center w-full">
            <Card className="py-[1vh] px-[1vw] space-y-[1vh]">
                <CardHeader>
                    <CardTitle className="justify-center flex">
                        📗Utwórz nowy kurs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CreateCourseForm/>
                </CardContent>
            </Card>
        </div>
    );
}
 
export default CreateCoursePage;