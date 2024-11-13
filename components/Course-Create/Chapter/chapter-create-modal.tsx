"use client"

import { CreateChapter } from "@/actions/chapter-teacher/chapter"
import { CreateChapterSchema } from "@/schemas/chapter"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { SquarePlus } from "lucide-react"
import { startTransition, useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = z.infer<typeof CreateChapterSchema>

const CreateChapterModal = ({
    courseId,
    onUpdate
} : {
    courseId:string,
    onUpdate: () => void
}) => {
    const { isOpen, onOpen, onOpenChange} = useDisclosure()
    const { register, handleSubmit, setError, watch, setValue, formState: { errors, isSubmitting }} = useForm<FormFields>({ 
        resolver: zodResolver(CreateChapterSchema),
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(async()=>{
            CreateChapter(data, courseId)
                .then(()=>{
                    toast.success("Dodano nowy rozdział")
                    onUpdate()
                    onOpenChange()
                })
                .catch((error)=>{
                    setError("title", {message: error.message})
                    toast.error(error.message)
                })
        })        
    }

    return (
        <main>
            <Button 
                color="primary"
                variant="light"
                onClick={()=>{
                    onOpen()
                    setValue("title", "")}
                }
            >
                <SquarePlus/>
                Dodaj nowy rozdział
            </Button>
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
                            <ModalHeader>Dodaj nowy rozdział</ModalHeader>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <ModalBody>
                                    <Input {...register("title")}
                                        label="Tytuł"
                                        labelPlacement="outside"
                                        type="text"
                                        placeholder="Aerodynamika"
                                        isRequired
                                        isClearable
                                        isDisabled={isSubmitting}
                                        variant="bordered"
                                        isInvalid={errors.title ? true : false}
                                        errorMessage={errors.title?.message}
                                    />
                                    {/*
                                    <Input {...register("title")}
                                        label="Tytuł"
                                        labelPlacement="outside"
                                        type="text"
                                        placeholder="Aerodynamika"
                                        isRequired
                                        isClearable
                                        disabled={isSubmitting}
                                        variant="bordered"
                                        isInvalid={errors.title ? true : false}
                                        errorMessage={errors.title?.message}
                                        onChange={(event)=>{
                                            const newTitle = event.target.value
                                            const generatedSlug = newTitle
                                                .toLowerCase()
                                                .replace(/[ąćęłńóśźż]/g, char => 
                                                    ({ 'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z' }[char] || char)
                                                )
                                                .replace(/\s+/g, '-') // Zamień spacje na myślniki
                                                .replace(/[^a-z0-9-]/g, '') // Usuń niedozwolone znaki
                                                .replace(/--+/g, '-') // Usuń wielokrotne myślniki
                                                .replace(/^-+|-+$/g, ''); // Usuń myślnik z początku i końca
                                                setValue("slug", generatedSlug)
                                            }}
                                    />
                                    <Input {...register("slug")}
                                        label="Unikalny odnośnik"
                                        labelPlacement="outside"
                                        type="text"
                                        placeholder={watch("slug") || "aerodynamika"}
                                        isRequired
                                        isClearable
                                        disabled={isSubmitting}
                                        variant="bordered"
                                        isInvalid={errors.slug ? true : false}
                                        errorMessage={errors.slug?.message}
                                    />
                                        */}
                                </ModalBody>
                                <ModalFooter>
                                    <Button 
                                        color="danger" 
                                        variant="light"
                                        isDisabled={isSubmitting}
                                        onClick={onClose}
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
export default CreateChapterModal