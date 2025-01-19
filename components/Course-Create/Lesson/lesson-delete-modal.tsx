"use client"

import { DeleteLessonById } from "@/actions/lesson-teacher/lesson"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react"
import { Lesson } from "@prisma/client"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "react-toastify"

const LessonDeleteModal = ({
    lesson,
} : {
    lesson: Lesson
}) => {
    const router = useRouter()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [isSubmitting, startTransition] = useTransition()

    const confirmDelete = async () => {
        startTransition(async()=>{
            await DeleteLessonById(lesson)
            .then(()=>{
                toast.success("Poumyślnie usunięto lekcję")
                router.refresh()
                onOpenChange()
            })
            .catch((error)=>{
                toast.error(error.message)
            })
        })
    }
    return (
        <main>
            <Trash
                className="hover:text-primary transition duration-300 cursor-pointer"
                onClick={onOpen}
            />
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                size="xs"
                isDismissable={false}
                backdrop="opaque"
                classNames={{
                    backdrop: "bg-gradient-to-t from-foreground/100 to-foreground/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose)=>(
                        <>
                            <ModalHeader>
                                Czy na pewno chcesz usunąć lekcję?
                            </ModalHeader>
                            <ModalBody>
                                {lesson.title}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    isDisabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    onPress={confirmDelete}
                                >
                                    {isSubmitting ? "Usuwanie..." : "Usuń"}
                                </Button>
                                <Button
                                    color="primary"
                                    variant="light"
                                    isDisabled={isSubmitting}
                                    onPress={onClose}
                                >
                                    Wyjdź
                                </Button>
                            </ModalFooter>
                        </>
                    )}    
                </ModalContent>   
            </Modal>
        </main>
    );
}
 
export default LessonDeleteModal;