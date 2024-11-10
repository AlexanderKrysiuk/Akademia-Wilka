"use client"

import { publishLesson, unpublishLesson } from "@/actions/lesson-teacher/lesson"
import { Button } from "@nextui-org/react"
import { useState } from "react"
import { toast } from "react-toastify"

const PublishLessonButton = ({
    lessonId,
    published,
    onUpdate,
    completedFields,
    requiredFields
} : {
    lessonId: string,
    published: boolean,
    onUpdate: () => void,
    completedFields: number,
    requiredFields: number
}) => {
    const [submitting, setSubmitting] = useState(false)
    const onSubmit = () => {
        setSubmitting(true)
        try {
            if (published === false) {
                publishLesson(lessonId)
                toast.success("Opublikowano lekcję")
            } else if (published === true) {
                unpublishLesson(lessonId)
                toast.info("Zmieniono na szkic")
            } else {
                toast.error("Wystąpił nieoczekiwany błąd")
            }
        } catch {
            toast.error("Wystąpił nieoczekiwany błąd")
        } finally {
            setSubmitting(false)
            onUpdate()
        }
    }

    return (
        <Button
            size="sm"
            className="text-white"
            isDisabled={(completedFields < requiredFields) || submitting}
            color={completedFields < requiredFields ? "warning" : "success"}
            isLoading={submitting}
            onClick={onSubmit}
        >
            {published ? "Zmień na szkic" : "Opublikuj"}
        </Button>
    )
}
export default PublishLessonButton