"use client"

import { unpublishLesson } from "@/actions/lesson-teacher/lesson"
import { Modal, ModalBody, ModalContent, ModalHeader, Progress, useDisclosure } from "@nextui-org/react"
import { Lesson, LessonType } from "@prisma/client"
import { Settings, SquarePen } from "lucide-react"
import { useRouter } from "next/navigation"
import LessonDeleteModal from "./lesson-delete-modal"
import LessonPublishButton from "./lesson-publish-button"
import LessonTitleCard from "./lesson-title-card"
import LessonImageForm from "./lesson-image-form"
import LessonVideoForm from "./lesson-video-form"

const LessonEditModal = ({
    lesson
} : {
    lesson: Lesson
}) => {
    const router = useRouter()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const media = lesson.media ? JSON.parse(lesson.media as string) : []

    const requiredFields = [
        lesson.title,
        lesson.ImageURL,
        lesson.type === LessonType.Video ? (media.length > 0 && media[0].url) : true,
    ]

    const completedFields = requiredFields.filter(Boolean).length

    if (completedFields < requiredFields.length && lesson.published) {
        unpublishLesson(lesson.id)
        .then(()=>{router.refresh()})
    }

    return (
        <main>
            <SquarePen
                className="hover:text-primary transition duration-300 cursor-pointer"
                onClick={onOpen}
            />
            <Modal
                isOpen={isOpen}
                isDismissable={false}
                onOpenChange={onOpenChange}
                placement="center"
                size="5xl"
                scrollBehavior="outside"
                backdrop="opaque"
                classNames={{
                    backdrop: "bg-gradient-to-t from-foreground/100 to-foreground/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose) => {
                        const handleClose = () =>{
                            router.refresh()
                            onClose()
                        }
                        return (
                            <>
                                <ModalHeader/>
                                <ModalHeader>
                                    <div className="flex justify-between w-full">
                                        <div className="flex gap-1 items-center">
                                            <Settings/>
                                            Lekcja: {lesson.title}
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <LessonPublishButton
                                                lesson={lesson} 
                                                completedFields={completedFields} 
                                                requiredFields={requiredFields.length}                                                
                                            />
                                            <LessonDeleteModal 
                                                lesson={lesson}                                                
                                            />
                                        </div>
                                    </div>
                                </ModalHeader>
                                <ModalHeader>
                                    <Progress
                                        label={`(${completedFields}/${requiredFields.length})`}
                                        value={completedFields/requiredFields.length*100}
                                        showValueLabel={true}
                                        color={completedFields/requiredFields.length === 1 ? "success" : "warning"}
                                    />
                                </ModalHeader>
                                <ModalBody>
                                    <LessonTitleCard
                                        id={lesson.id}
                                        title={lesson.title}
                                    />
                                    <LessonImageForm
                                        lesson={lesson}
                                    />
                                    <LessonVideoForm
                                        lesson={lesson}
                                    />
                                </ModalBody>
                            </>
                        )
                    }}
                </ModalContent>
            </Modal>
        </main>
    )
}
export default LessonEditModal