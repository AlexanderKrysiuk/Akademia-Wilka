"use client"

import { DeleteChapterById } from "@/actions/chapter-teacher/chapter"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { Chapter } from "@prisma/client"
import { Trash } from "lucide-react"
import { useTransition } from "react"
import { toast } from "react-toastify"

const DeleteChapterModal = ({
    chapter,
    courseId,
    onUpdate
} : {
    chapter: Chapter
    courseId:string,
    onUpdate: () => void
}) => {
    const { isOpen, onOpen, onOpenChange} = useDisclosure()
    const [isSubmitting, startTransition] = useTransition()

    const confirmDelete = async () => {
        startTransition(async()=>{
            DeleteChapterById(courseId, chapter.id)
            .then((data)=>{
                toast.success("Pomyślnie usunięto rozdział")
                onUpdate()
                onOpenChange()
            })
            .catch((error)=>{toast.error(error.message)})
        })        
    }

    return (
        <main>
            <Trash
                className="hover:text-primary transition duration-300 cursor-pointer"
                onClick={()=>{onOpen()}}
            />
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                size="xs"
                backdrop="opaque"
                classNames={{
                    backdrop: "bg-gradient-to-t from-foreground/100 to-foreground/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose)=>(
                        <>
                            <ModalHeader>Czy na pewno chcesz usunąć rodział?</ModalHeader>
                            <ModalBody>
                                   {chapter.title}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger" 
                                    variant="light"
                                    isDisabled={isSubmitting}
                                    isLoading={isSubmitting}
                                    onClick={confirmDelete}
                                >
                                    {isSubmitting ? "Usuwanie..." : "Usuń"}
                                </Button>
                                <Button
                                    color="primary"
                                    variant="light"
                                    isDisabled={isSubmitting}
                                    onClick={onClose}
                                >
                                    Wyjdź
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </main>
    )
}
export default DeleteChapterModal