"use client"

import { EditCourseSlug } from "@/actions/course-teacher"
import { EditCourseSlugSchema } from "@/schema/course"
import { Button, Form, Input } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = z.infer<typeof EditCourseSlugSchema>

const EditCourseSlugForm = ({
    courseId,
    slug
} : {
    courseId: string,
    slug: string | undefined
}) => {
    const router = useRouter()
    const { register, handleSubmit, setError, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormFields>({
        resolver: zodResolver(EditCourseSlugSchema),
        defaultValues: {
            courseId,
            slug
        }
    })

    const slugValue = watch("slug")

    const handleSlugChange = (value: string) => {
        const formattedSlug = value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Usuwa polskie znaki
            .replace(/\s+/g, "-") // Zamienia spacje na "-"
            .replace(/[^a-z0-9-\s]/g, "") // Pozwala na myślniki, usuwa inne niedozwolone znaki
            .replace(/--+/g, "-") // Usuwa podwójne myślniki i zamienia je na pojedynczy myślnik

        setValue("slug", formattedSlug, { shouldValidate: true })
    }

    const submit: SubmitHandler<FormFields> = async (data) => {
        // Ręcznie aktualizujemy wartość sluga po walidacji Zoda
        setValue("slug", data.slug);
        try {
            await EditCourseSlug(data)
            toast.success("Unikalny odnośnik kursu został zmieniony")
            router.refresh()
        } catch (error) {
            setError("root", {message: error instanceof Error ? error.message : "Wystąpił nieznany błąd"})
        }
    }

    return <Form onSubmit={handleSubmit(submit)}>
        <Input {...register("slug")}
            label="Unikalny odnośnik"
            labelPlacement="outside"
            type="text"
            placeholder="rocket-science"
            variant="bordered"
            value={slugValue} // 🟢 Zarządzanie wartością ręcznie
            onChange={(e) => handleSlugChange(e.target.value)} // 🟢 Obsługa zmiany wartości
            isRequired
            isClearable
            isDisabled={isSubmitting}
            isInvalid={!!errors.slug || !!errors.root}
            errorMessage={errors.slug?.message || errors.root?.message}
            fullWidth
        />
        <Button
            type="submit"
            color="primary"
            isDisabled={isSubmitting || !watch("slug") || watch("slug") === slug}
            isLoading={isSubmitting}
            className="text-white"
        >
            {isSubmitting ? "Przetwarzanie..." : "Zmień unikalny odnośnik"}
        </Button>
    </Form>
}

export default EditCourseSlugForm;