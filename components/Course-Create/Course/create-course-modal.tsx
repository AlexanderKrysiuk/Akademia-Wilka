"use client"

import { CreateCourse } from "@/actions/course-teacher/course";
import { useCurrentUser } from "@/hooks/user";
import { CreateCourseSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { UserRole } from "@prisma/client";
import { SquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

type FormFields = z.infer<typeof CreateCourseSchema>

const CreateCourseModal = () => {
    const user = useCurrentUser()
    const router = useRouter()

    if (!user || !user.role.includes(UserRole.Teacher || UserRole.Admin)) return null

    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { register, handleSubmit, setError, formState: { errors, isSubmitting }} = useForm<FormFields>({ resolver: zodResolver(CreateCourseSchema)})

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(async ()=>{
            CreateCourse(data,user.id)
                .then((courseId)=>{
                    toast.success("Kurs został utworzony!")
                    onOpenChange()
                    router.push(`/teacher/my-courses/${courseId}`); 

                })
                .catch((error)=>{
                    setError("title" , {message: error.message})
                    toast.error(error.message)
                })
        })
    }

    return ( 
        <main>
            <Button color='primary' onPress={onOpen}>
                <SquarePlus/>
                Utwórz nowy kurs
            </Button>
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                placement='center'
                size='xs'    
                backdrop="opaque"
                classNames={{
                    backdrop: "bg-gradient-to-t from-foreground/100 to-foreground/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Utwórz nowy kurs</ModalHeader>
                            <form onSubmit={handleSubmit(onSubmit)} className="max-w-xs w-full">
                                <ModalBody>
                                    <Input {...register("title")}
                                        label="Tytuł"
                                        labelPlacement="outside"
                                        type="text"
                                        placeholder="Rocket Science"
                                        isRequired
                                        isClearable
                                        disabled={isSubmitting}
                                        variant="bordered"
                                        isInvalid={errors.title ? true : false}
                                        errorMessage={errors.title?.message}
                                    />  
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" disabled={isSubmitting} onPress={onClose}>
                                        Wyjdź
                                    </Button>
                                    <Button type="submit" color="primary" disabled={isSubmitting} isLoading={isSubmitting}>
                                        {isSubmitting ? "Dodawanie..." : "Utwórz"}
                                    </Button>
                            </ModalFooter>                        
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </main>
    );
}
 
export default CreateCourseModal;