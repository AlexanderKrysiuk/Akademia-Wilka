"use client"

import { CourseSchema } from "@/schema/course";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Form, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type FormFields = z.infer<typeof CourseSchema>

const CreateCourseModal = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure()
    
    const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting } } = useForm<FormFields>({
        resolver: zodResolver(CourseSchema)
    })

    const submit: SubmitHandler<FormFields> = async (data) => {
        console.log(data)
        setError("root", { message: "lint qurwa"})
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