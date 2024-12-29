"use client"

import { unpublishChapter } from "@/actions/chapter-teacher/chapter"
import { GetLessonsByChapterId } from "@/actions/lesson-teacher/lesson"
import PageLoader from "@/components/page-loader"
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress, useDisclosure } from "@nextui-org/react"
import { Chapter, Lesson } from "@prisma/client"
import { Settings, SquarePen } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { toast } from "react-toastify"
import ChapterDeleteModal from "./chapter-delete-modal"
import PublishChapterButton from "./chapter-publish-button"
import ChapterTitleForm from "./chapter-title-form"
import ChapterSlugForm from "./chapter-slug-form"
import LessonsList from "../Lesson/lessons-list"

const ChapterEditModal = ({
    chapter,
    requiredFields,
    lessons,
    onUpdate,
} : {
    chapter: Chapter,
    requiredFields: (string | boolean | null)[]
    lessons: Lesson[]
    onUpdate: () => void
}) => {
    const [loading, setLoading] = useState(true)
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    // Memoize requiredFields to avoid unnecessary recalculations
    const completedFields = useMemo(() => requiredFields.filter(Boolean).length, [requiredFields])

    useEffect(() => {
        if (completedFields < requiredFields.length && chapter.published) {
            unpublishChapter(chapter.id)
            toast.warning("Rozdział zmienił status na:szkic, uzupełnij wszystkie pola by go opublikować")
        }
        setLoading(false)
    }, [chapter.id, chapter.published, completedFields, requiredFields.length])

    if (loading) return <PageLoader />

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
                scrollBehavior="inside"
                backdrop="opaque"
                classNames={{
                    backdrop: "bg-gradient-to-t from-foreground/100 to-foreground/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex justify-between mt-8">
                                <div className="flex gap-2 items-center">
                                    <Settings />
                                    Rozdział: {chapter.title}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <ChapterDeleteModal
                                        chapter={chapter}
                                        onUpdate={() => {
                                            onUpdate()
                                            onClose()
                                        }}
                                    />
                                    <PublishChapterButton
                                        chapterId={chapter.id}
                                        published={chapter.published}
                                        onUpdate={onUpdate}
                                        completedFields={completedFields}
                                        requiredFields={requiredFields.length}
                                    />
                                </div>
                            </ModalHeader>
                            <ModalHeader>
                                <Progress
                                    label={`(${completedFields}/${requiredFields.length})`}
                                    value={(completedFields / requiredFields.length) * 100}
                                    showValueLabel={true}
                                    color={completedFields / requiredFields.length === 1 ? "success" : "warning"}
                                />
                            </ModalHeader>
                            <Divider />
                            <ModalBody>
                                <ChapterTitleForm
                                    chapterId={chapter.id}
                                    title={chapter.title}
                                    onUpdate={onUpdate}
                                />

                                <Divider />

                                <ChapterSlugForm
                                    courseId={chapter.courseId}
                                    chapterId={chapter.id}
                                    slug={chapter.slug}
                                    onUpdate={onUpdate}
                                />

                                <Divider />
                                <LessonsList
                                    chapter={chapter}
                                    lessons={lessons}
                                    onUpdate={onUpdate}
                                />
                            </ModalBody>
                            <Divider />
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    variant="light"
                                    onClick={onClose}
                                >
                                    Zakończ edycję
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </main>
    )
}
export default ChapterEditModal
