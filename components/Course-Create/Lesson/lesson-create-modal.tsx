"use client"

import { CreateLesson } from "@/actions/lesson-teacher/lesson"
import { CreateLessonSchema } from "@/schemas/lesson"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react"
import { LessonType } from "@prisma/client"
import { SquarePlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { startTransition } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = z.infer<typeof CreateLessonSchema>

const CreateLessonModal = ({
    courseId
} : {
    courseId: string
}) => {
    const router = useRouter()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { control, register, handleSubmit, setError, setValue, formState: { errors, isSubmitting }} = useForm<FormFields>({
        resolver: zodResolver(CreateLessonSchema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (fields) => {
        startTransition(async()=>{
            await CreateLesson(fields, courseId)
                .then(()=>{
                    toast.success("Dodano nową lekcję")
                    router.refresh()
                    onOpenChange()                   
                })
                .catch((error)=>{
                    setError("root", {message: error.message})
                    toast.error(error.message)
                })
        })
    }

    return (
        <main>
            <Button
                color="primary"
                variant="bordered"
                size="sm"
                onPress={()=>{
                    setValue("title","")
                    onOpen()
                }}
            >
                <SquarePlus/>
                Dodaj nową lekcję
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                isDismissable={false}
                placement="center"
                size="xs"
                backdrop="opaque"
                classNames={{
                    backdrop: "bg-gradient-to-t from-foreground/100 to-foreground/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                Dodaj nową lekcję
                            </ModalHeader>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <ModalBody>
                                    <Input 
                                        {...register("title")}
                                        label="Tytuł"
                                        labelPlacement="outside"
                                        type="text"
                                        placeholder="Teoria względności"
                                        isRequired
                                        isClearable
                                        isDisabled={isSubmitting}
                                        variant="bordered"
                                        isInvalid={!!errors.title}
                                        errorMessage={errors.title?.message}
                                    />
                                    <Controller
                                        name="lessonType"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                label="Typ lekcji"
                                                labelPlacement="outside"
                                                isRequired
                                                variant="bordered"
                                                isInvalid={!!errors.lessonType}
                                                errorMessage={errors.lessonType?.message}
                                                placeholder="Wybierz typ lekcji"
                                            >
                                                {Object.values(LessonType).map((lessonType)=>(
                                                    <SelectItem
                                                        key={lessonType}
                                                        value={lessonType}
                                                    >
                                                        {lessonType}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        isDisabled={isSubmitting}
                                        onPress={onClose}
                                    >
                                        Wyjdź
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        isDisabled={isSubmitting}
                                        isLoading={isSubmitting}
                                    >
                                        {isSubmitting ? "Dodawanie..." : "Utwórz"}
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </main>
    )
}
export default CreateLessonModal