"use client"

import { publishChapter, unpublishChapter } from "@/actions/chapter-teacher/chapter"
import { Button } from "@nextui-org/react"
import { Eye, EyeOff } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "react-toastify"

const PublishChapterButton = ({
    chapterId,
    published,
    onUpdate,
    completedFields,
    requiredFields,
    isIcon
} : {
    chapterId: string,
    published: boolean,
    onUpdate: () => void,
    completedFields: number,
    requiredFields: number,
    isIcon?: boolean
}) => {
    const [submitting, setSubmitting] = useState(false)

    const onSubmit = () => {
        setSubmitting(true)
        try {
            if (published === false) {
                publishChapter(chapterId)
                toast.success("Opublikowano rozdział")
            } else if (published === true) {
                unpublishChapter(chapterId)
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
    
    if (isIcon) {

        const isDisabled = completedFields < requiredFields || submitting;
        const iconClasses = `cursor-${isDisabled ? "not-allowed" : "pointer"} transition-transform transform ${
            isDisabled
                ? "text-warning"
                : "text-successj"
        }`;

        return published ? (
            <EyeOff className={iconClasses} onClick={!isDisabled ? onSubmit : undefined} />
        ) : (
            <Eye className={iconClasses} onClick={!isDisabled ? onSubmit : undefined} />
        );
    } else {
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

}
export default PublishChapterButton