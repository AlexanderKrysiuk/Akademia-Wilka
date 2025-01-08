"use client"

import { unpublishLesson } from "@/actions/lesson-teacher/lesson"
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress, useDisclosure } from "@nextui-org/react"
import { Chapter, Lesson, LessonType } from "@prisma/client"
import { Settings, SquarePen } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import LessonDeleteModal from "./lesson-delete-modal"
import PublishLessonButton from "./lesson-publish-button"
import LessonTitleCard from "./lesson-title-card"
import LessonSlugForm from "./lesson-slug-form"
import LessonVideoCard from "./lesson-video-card"
import LessonVideoImageForm from "./lesson-video-image-form"
import LessonFreeForm from "./lesson-free-form"

const LessonEditModal = ({
    chapter,
    lesson,
    requiredFieldsNumber,
    completedFieldsNumber,
    onUpdate
}: {
    chapter: Chapter
    lesson: Lesson
    requiredFieldsNumber: number
    completedFieldsNumber: number
    onUpdate: () => void
}) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();    
    // Oblicz postęp na podstawie wypełnionych pól
    
    // Obsługa zmiany statusu publikacji
   

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
                        const handleClose = () => {
                            onUpdate(); // Wywołaj onUpdate
                            onClose();  // Zamknij modal
                        };

                        return (
                            <>
                                <ModalHeader className="mt-8 grid-flow-row grid gap-y-4">
                                    <div className="justify-between flex w-full">
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
                                                onUpdate={onUpdate}
                                                completedFields={completedFieldsNumber}
                                                requiredFields={requiredFieldsNumber}
                                            />
                                        </div>
                                    </div>
                                    <Progress
                                        label={`(${completedFieldsNumber}/${requiredFieldsNumber})`} // Pokazanie liczby z wymaganymi i uzupełnionymi polami
                                        value={(completedFieldsNumber/requiredFieldsNumber)*100}
                                        showValueLabel
                                        color={completedFieldsNumber / requiredFieldsNumber === 1 ? "success" : "warning"}
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
                                            <Divider/>
                                            <LessonFreeForm
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
                                            <Divider/>
                                            <LessonVideoImageForm
                                                chapter={chapter}
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
    );
}

export default LessonEditModal;
