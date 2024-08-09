"use client"
import CreateCourseForm from "@/components/dashboard/teacher/courses/create-course-form";
import { checkIfTeacherRedirect } from "@/hooks/user";

import { useTransition } from "react";
const CreateCoursePage = () => {
    checkIfTeacherRedirect
    const [isPending, startTransition] = useTransition() 

    return ( 
        <div>
           <CreateCourseForm/>
        </div>
    );
}
 
export default CreateCoursePage;