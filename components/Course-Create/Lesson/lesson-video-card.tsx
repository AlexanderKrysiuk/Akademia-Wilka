"use client"

import { uploadLessonVideo } from "@/actions/lesson-teacher/lesson-video"
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react"
import { Lesson } from "@prisma/client"
import { useRef } from "react"
import { toast } from "react-toastify"

const LessonVideoCard = ({
    courseId,
    chapterId,
    lesson,
    onUpdate
} : {
    courseId:string,
    chapterId:string,
    lesson:Lesson,
    onUpdate: () => void
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const videoElement = document.createElement("video")
        videoElement.src = URL.createObjectURL(file)

        videoElement.onloadedmetadata = async () => {
            const formData = new FormData()
            formData.append("video", file)
            formData.append("courseId", courseId)
            formData.append("chapterId", chapterId)
            formData.append("lessonId", lesson.id)
            formData.append("duration", videoElement.duration.toString())

            try {
                await uploadLessonVideo(formData)
                toast.success("Film przesłany pomyślnie")
                onUpdate()
            } catch (error) {
                toast.error("Nie udało się przesłać filmu")
            }
        }
    }

    return (
        <main>
            <CardHeader className="flex items-center justify-between">
                <span>Video</span>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4"
                    style={{ display: "none" }}
                    onChange={handleVideoUpload}
                />
            </CardHeader>
            <CardBody>
                {lesson.mediaURLs.length > 0 ? (
                    <video controls>
                        <source src={lesson.mediaURLs[0]} type="video/mp4"/>
                    </video>
                ) : (
                    <div className="w-full flex justify-center">
                        Brak video
                    </div>
                )}
            </CardBody>
            <CardFooter>
                <Button color="primary" onClick={()=>fileInputRef.current?.click()}>
                    {lesson.mediaURLs.length > 0 ? "Zmień video" : "Dodaj video"}
                </Button>

            </CardFooter>
        </main>
    )
}
export default LessonVideoCard