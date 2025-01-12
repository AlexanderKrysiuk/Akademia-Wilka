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
}: {
    lessonId: string
    published: boolean
    onUpdate: () => void
    completedFields: number
    requiredFields: number
}) => {
    const [submitting, setSubmitting] = useState(false)
    const [isPublished, setIsPublished] = useState(published) // Stan przycisku

    const onSubmit = async () => {
        if (submitting) return // Zapobiegamy wielokrotnemu kliknięciu przycisku
        setSubmitting(true)

        if (completedFields < requiredFields) {
            toast.warning("Uzupełnij wszystkie pola przed opublikowaniem.");
            setSubmitting(false); // Zatrzymaj ładowanie przycisku
            return;
        }

        try {
            // W zależności od stanu publikacji, publikujemy lub wycofujemy lekcję
            if (!isPublished) {
                await publishLesson(lessonId) // Zakładając, że publishLesson zwróci Promise
                toast.success("Lekcja została opublikowana!")
                setIsPublished(true) // Zaktualizuj stan przycisku po udanej publikacji
            } else {
                await unpublishLesson(lessonId) // Zakładając, że unpublishLesson zwróci Promise
                toast.info("Lekcja została zmieniona na szkic.")
                setIsPublished(false) // Zaktualizuj stan przycisku po wycofaniu publikacji
            }
        } catch (error) {
            console.error(error)
            toast.error("Wystąpił nieoczekiwany błąd podczas zmiany statusu lekcji.")
        } finally {
            setSubmitting(false)
            onUpdate() // Zaktualizuj stan po zakończeniu
        }
    }

    return (
        <Button
            size="sm"
            isDisabled={completedFields < requiredFields || submitting}
            color={completedFields < requiredFields ? "warning" : "success"}
            isLoading={submitting}
            onClick={onSubmit}
            className="text-white"
        >
            {isPublished ? "Zmień na szkic" : "Opublikuj"}
        </Button>
    )
}

export default PublishLessonButton
