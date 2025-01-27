"use client"

import { CoursePaymentPage } from "@/actions/stripe/course-page"
import { useCurrentUser } from "@/hooks/user"
import { RegisterSchema } from "@/schemas/user"
import { Button } from "@heroui/button"
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card"
import { Input } from "@heroui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Course } from "@prisma/client"
import { useState } from "react"
import { Form, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"


export const RegisterAndPayCard = (course:Course) => {

    const [loginForm, setLoginForm] = useState(false)
    type FormFields = z.infer<typeof RegisterSchema>

    const { register, handleSubmit, setError, watch, formState: {errors, isSubmitting}} = useForm<FormFields>({
        resolver: zodResolver(RegisterSchema) 
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            await CoursePaymentPage(course.id, data.email, data.name)
        } catch(error) {
            console.error(error)
            // Obsługuje błędy i wyświetla toast z wiadomością
            if (error instanceof Error) {
                toast.error(error.message) // Wyświetla wiadomość błędu
            } else {
                toast.error("Wystąpił nieoczekiwany błąd.") // Obsługuje inne rodzaje błędów
            }        
        }
    }

    return (
        <Card>
            <CardHeader>
                Załóż konto i uzyskaj dostęp do kursu
            </CardHeader>
            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <CardBody>
                    <Input {...register("email")}
                        label="Email"
                        labelPlacement="outside"
                        type="email"
                        placeholder="jack.sparrow@pirate.com"
                        isRequired
                        isClearable
                        isDisabled={isSubmitting}
                        variant="bordered"
                        isInvalid={!!errors.email}
                        errorMessage={errors.email?.message}
                        autoComplete="email"
                    />
                    <Input {...register("name")}
                        label="Imię i nazwisko"
                        labelPlacement="outside"
                        type="text"
                        placeholder="Jack Sparrow"
                        isClearable
                        isDisabled={isSubmitting}
                        variant="bordered"
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message}
                        autoComplete="name"
                    />
                </CardBody>
                <CardFooter>
                    <Button
                        type="submit"
                        color="primary"
                        fullWidth
                        disabled={isSubmitting || !watch("email")}
                        isLoading={isSubmitting}
                        className="text-white"
                    >
                        {isSubmitting ? `Ładowanie...` : `Zapłać ${course.price}zł`}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}