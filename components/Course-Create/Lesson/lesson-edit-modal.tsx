"use client"

import { unpublishLesson } from "@/actions/lesson-teacher/lesson"
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress, useDisclosure } from "@nextui-org/react"
import { Chapter, Lesson, LessonType } from "@prisma/client"
import { Settings, SquarePen } from "lucide-react"
import { useEffect } from "react"
import { toast } from "react-toastify"
import LessonDeleteModal from "./lesson-delete-modal"
import PublishLessonButton from "./lesson-publish-button"
import LessonTitleCard from "./lesson-title-card"
import LessonSlugForm from "./lesson-slug-form"
import LessonVideoCard from "./lesson-video-card"

const LessonEditModal = ({
    chapter,
    lesson,
    requiredFields,
    onUpdate
} : {
    chapter: Chapter
    lesson: Lesson 
    requiredFields: (string | boolean | null)[]
    onUpdate: () => void
}) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const completedFields = requiredFields.filter(Boolean).length

    useEffect(()=>{
        if (completedFields < requiredFields.length && lesson.published) {
            unpublishLesson(lesson.id)
            toast.warning("Rozdział zmienił status na:szkic, uzupełnij wszystkie pola by go opublikować")
        }
        
    },[lesson.published])

    return (
        <main>
            <SquarePen
                className="hover:text-primary transition duration-300 cursor-pointer"
                onClick={onOpen}
            />
            <Modal
                isOpen={isOpen}
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
        const handleClose = () => {
            onUpdate(); // Wywołaj onUpdate
            onClose();  // Zamknij modal
        };

        return (
            <>
                <ModalHeader className="flex justify-between mt-8">
                    <div className="flex gap-2 items-center">
                        <Settings />
                        Lekcja: {lesson.title}
                    </div>
                    <div className="flex gap-2 items-center">
                        <LessonDeleteModal
                            lesson={lesson}
                            chapter={chapter}
                            onUpdate={() => {
                                onUpdate();
                                onClose();
                            }}
                        />
                        <PublishLessonButton
                            lessonId={lesson.id}
                            published={lesson.published}
                            onUpdate={()=>{}}
                            completedFields={completedFields}
                            requiredFields={requiredFields.length}
                        />
                    </div>
                </ModalHeader>
                <ModalHeader>
                    <Progress
                        label={`(${completedFields}/${requiredFields.length})`}
                        value={(completedFields / requiredFields.length) * 100}
                        showValueLabel
                        color={completedFields / requiredFields.length === 1 ? "success" : "warning"}
                    />
                </ModalHeader>
                <Divider />
                <ModalBody>
                    <LessonTitleCard
                        lessonId={lesson.id}
                        title={lesson.title}
                        onUpdate={onUpdate}
                    />
                    {lesson.type !== LessonType.Subchapter && (
                        <>
                            <Divider />
                            <LessonSlugForm
                                lesson={lesson}
                                onUpdate={onUpdate}
                            />
                        </>
                    )}
                    {lesson.type === LessonType.Video && (
                        <>
                            <Divider />
                            <LessonVideoCard
                                courseId={chapter.courseId}
                                chapterId={chapter.id}
                                lesson={lesson}
                                onUpdate={onUpdate}
                            />
                        </>
                    )}
                </ModalBody>
                <Divider />
                <ModalFooter>
                    <Button
                        color="primary"
                        variant="light"
                        onClick={handleClose} // Użyj nowej funkcji
                    >
                        Zakończ Edycję
                    </Button>
                </ModalFooter>
            </>
        );
    }}
</ModalContent>

            </Modal>
        </main>
    )
}
export default LessonEditModal