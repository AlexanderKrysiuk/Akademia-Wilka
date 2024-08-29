"use client"
import CreateCourseForm from "@/components/dashboard/teacher/courses/create-course-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateCoursePage = () => {

    return ( 
            <Card className="mx-[1vw] my-[1vh] py-[1vh] px-[1vw] space-y-[1vh]">
                <CardHeader>
                    <CardTitle className="justify-center flex">
                        📗Utwórz nowy kurs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CreateCourseForm/>
                </CardContent>
            </Card>
    );
}
 
export default CreateCoursePage;