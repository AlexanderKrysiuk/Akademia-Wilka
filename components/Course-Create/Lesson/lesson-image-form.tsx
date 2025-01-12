"use client"

import { UploadLessonImage } from "@/actions/lesson-teacher/lesson-image"
import { sanitizeFileName } from "@/utils/link"
import { Button, CardBody, CardHeader, Image, Input, Spinner } from "@nextui-org/react"
import { Lesson } from "@prisma/client"
import { ImageOff, ImagePlus, ImagePlusIcon, Images } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "react-toastify"

const LessonImageForm = ({
    lesson
}:{
    lesson: Lesson
}) => {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [submitting, setSubmitting] = useState(false)
    const MAX_FILE_SIZE = 1024*1024*5

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return
        setSubmitting(true)
        const file = event.target.files[0]
        if (file.size > MAX_FILE_SIZE) {
            toast.error("Maksymalna wielkość pliku to 5MB")
            return
        }
        const formData = new FormData()
        const fileName = sanitizeFileName(file.name)
        formData.append("file", file)
        formData.append("fileName", fileName)
        formData.append("lessonId", lesson.id)

        try {
            UploadLessonImage(formData)
            toast.success("Zaktualizowano obrazek wyróżniający")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Wystąpił nieoczekiwany błąd")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main>
            <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
            />
            <CardHeader
                className="flex justify-between items-center"
            >
                <div>
                    Obrazek wyróvniający
                </div>
                <Button
                    color="primary"
                    size="sm"
                    variant="light"
                    startContent={lesson.ImageURL ? <Images/> : <ImagePlus/>}
                    onPress={()=>{fileInputRef.current?.click()}}
                >
                    {lesson.ImageURL ? "Zmień obraz" : "Prześlij   obraz"}
                </Button>
            </CardHeader>
            <CardBody className="flex items-center">
                {submitting ? (
                    <Spinner
                        color="primary"
                        label="Przesyłanie..."
                        labelColor="primary"
                    />
                ):(
                    lesson.ImageURL ? (
                        <Image
                            src={lesson.ImageURL!}
                            className="max-w-full h-auto aspect-video"
                        />
                    ):(
                        <div className="w-full h-auto bg-primary/10 flex flex-col items-center py-10">
                            <ImageOff
                                className="w-10 h-auto text-primary"
                            />
                            <span
                                className="text-primary"
                            >
                                Brak Obrazka
                            </span> 
                        </div>
                    )
                )}
            </CardBody>
        </main>
    )

}
export default LessonImageForm