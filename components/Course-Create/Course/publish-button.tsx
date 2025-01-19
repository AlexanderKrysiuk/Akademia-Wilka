"use client"

import { publishCourse, unpublishCourse } from "@/actions/course-teacher/course"
import { useCurrentUser } from "@/hooks/user"
import { Button } from "@heroui/button"
import { UserRole } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"

const PublishButton = ({
    courseId,
    published,
    completedFields,
    requiredFields,
} : {
    courseId: string,
    published: boolean,
    completedFields: number,
    requiredFields: number
}) => {
    const user = useCurrentUser()
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    if (!user || !user.role.includes(UserRole.Teacher || UserRole.Admin)) return

    const onSubmit = () => {
        setSubmitting(true)
        try {
            if (published === false) {
                publishCourse(courseId)
                toast.success("Opublikowano kurs")
            } else if (published === true) {
                unpublishCourse(courseId)
                toast.info("Zmieniono na szkic")
            } else {
                toast.error("Wystąpił nieoczekiwany błąd")
            }
        } catch {
            toast.error("Wystąpił nieoczekiwany błąd")
        } finally {
            setSubmitting(false)
            router.refresh()
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
export default PublishButton;