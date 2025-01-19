"use client"

import { changeLessonPublicity } from "@/actions/lesson-teacher/lesson";
import { Button } from "@heroui/react";
import { Lesson } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const LessonPublishButton = ({
    lesson,
    completedFields,
    requiredFields,
} : {
    lesson: Lesson
    completedFields: number
    requiredFields: number
}) => {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)

    const onSubmit = () => {
        setSubmitting(true)
        changeLessonPublicity(lesson)
        .then((data)=>{
            if (data.published === true){
                toast.success("Lekcja opublikowana")
            } else {
                toast.info("Status lekcji zmieniono na szkic")
            }
        })
        .catch((error)=>{
            console.error(error)
            toast.error(error?.message)
        })
        .finally(()=>{
            setSubmitting(false)
            router.refresh()
        })
    }

    return (
        <Button
            size="sm"
            className="text-white"
            isDisabled={(completedFields<requiredFields) || submitting}
            color={completedFields < requiredFields ? "warning" : "success"}
            isLoading={submitting}
            onPress={onSubmit}
        >
            {lesson.published ? "Zmień na szkic" : "Opublikuj"}            
        </Button>
    );
}
 
export default LessonPublishButton;