"use client"

import { deleteLessonByID } from "@/actions/course/lesson"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Lesson } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useTransition } from "react"

interface DeleteLessonFormProps {
    userID: string
    lesson: Lesson | undefined
    onClose: () => void
    onUpdate: () => void
}

const DeleteLessonForm = ({
    userID,
    lesson,
    onClose,
    onUpdate
} : DeleteLessonFormProps) => {
    if (!userID || !lesson) return;

    const [isPending, startTransition] = useTransition()

    const onSubmit = () => {
        startTransition(()=>{
            deleteLessonByID(lesson.id, userID)
            .then((data) => {
                toast({
                    title: data.success ? "✅ Sukces!" : "❌ Błąd!",
                    description: data.message,
                    variant: data.success? "success" : "failed",
                });
                if (data.success) {
                    onUpdate(); // Wywołaj onUpdate po udanej aktualizacji
                }
            })
        })
    }
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <Card className="bg-background px-[1vw] py-[1vh]">
                <CardHeader className="flex items-center">
                    <CardTitle>Czy na pewno chcesz usunąć?</CardTitle>
                    {lesson.title}
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center">
                        <Button variant='outline' onClick={onClose} disabled={isPending}>
                            Anuluj
                        </Button>
                        <Button variant='destructive' onClick={onSubmit} disabled={isPending}>
                            Usuń
                        </Button>
                    </div>
                    {isPending && (
                        <div className="flex items-center justify-center mt-2">
                            <Loader2 className="animate-spin" />
                            <span> Usuwanie lekcji...</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default DeleteLessonForm;