"use client"

import { CourseCreate } from "@/actions/course-teacher";
import { CourseSchema } from "@/schema/course";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Form, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type FormFields = z.infer<typeof CourseSchema>

const CreateCourseModal = () => {
    const router = useRouter()
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure()
    
    const { register, handleSubmit, setError, watch, reset, formState: { errors, isSubmitting } } = useForm<FormFields>({
        resolver: zodResolver(CourseSchema)
    })

    const submit: SubmitHandler<FormFields> = async (data) => {
        try {
            await CourseCreate(data)
            router.refresh()
            onClose()
            reset()
        } catch (error) {
            setError("root", { message: error instanceof Error ? error.message : "Wystąpił nieznany błąd" })
        }
    }
    
    return (
        <main>
            <Button
                color="primary"
                className="text-white"
                startContent={<FontAwesomeIcon icon={faSquarePlus}/>}
                onPress={onOpen}
            >
                Dodaj nowy kurs
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
            >
                <ModalContent>
                    <ModalHeader>
                        Utwórz nowy kurs
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={handleSubmit(submit)}>
                            <Input {...register("title")}
                                label="Tytuł"
                                labelPlacement="outside"
                                type="text"
                                placeholder="Rocket Science"
                                variant="bordered"
                                isRequired
                                isClearable
                                isDisabled={isSubmitting}
                                isInvalid={!!errors.title || !!errors.root}
                                errorMessage={errors.title?.message}
                                fullWidth
                            />
                            {errors.root && 
                                <Alert
                                    color="danger"
                                    title={errors.root.message}
                                />
                            }
                            <div className="flex justify-end w-full">
                                <Button
                                    type="submit"
                                    color="primary"
                                    isDisabled={isSubmitting || !watch("title")}
                                    isLoading={isSubmitting}
                                    className="text-white"
                                >
                                    {isSubmitting ? "Przetwarzanie..." : "Utwórz"}
                                </Button>
                            </div>
                        </Form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </main>
    );
}
export default CreateCourseModal;