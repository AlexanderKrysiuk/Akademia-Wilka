"use client"

import { RegisterSchema } from "@/schema/auth";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { Button } from "@heroui/button";
import { registerNewUser } from "@/actions/auth";
import { Alert, Link } from "@heroui/react";
import { toast } from "react-toastify";

type FormFields = z.infer<typeof RegisterSchema>

const RegisterForm = () => {
    const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting } } = useForm<FormFields>({
        resolver: zodResolver(RegisterSchema)
    }) 

    const submit: SubmitHandler<FormFields> = async (data) => {
        const result = await registerNewUser(data)
        if (result.error) {
            setError(result.error.field as keyof FormFields, { message: result.error.message })
            return
        } 
        toast.success("Utworzono nowe konto, wysłano email weryfikacyjny")
    }

    return ( 
        <Form onSubmit={handleSubmit(submit)}>
            <Input {...register("name")}
                label="Imię i nazwisko"
                labelPlacement="outside"
                type="text"
                autoComplete="name"
                placeholder="Jack Sparrow"
                variant="bordered"
                isClearable
                isDisabled={isSubmitting}
                isInvalid={!!errors.name || !!errors.root}
                errorMessage={errors.name?.message}
            />
            <Input {...register("email")}
                label="Email"
                labelPlacement="outside"
                type="email"
                autoComplete="email"
                placeholder="jack.sparrow@piratebay.co.uk"
                variant="bordered"
                isClearable
                isRequired
                isDisabled={isSubmitting}
                isInvalid={!!errors.email || !!errors.root}
                errorMessage={errors.email?.message}
            />
            {errors.root && (
                <Alert 
                    title={errors.root.message}
                    variant="bordered"
                    color="danger"    
                />
            )}
            <Button
                type="submit"
                color="primary"
                fullWidth
                isDisabled={isSubmitting || !watch("email")}
                isLoading={isSubmitting}
                className="text-white"
            >
                {isSubmitting ? "Przetwarzanie..." : "Załóż konto"}
            </Button>
            <div
                className="text-xs"
            >
                {`Zakładając konto, akceptujesz `} 
                <Link
                    href="/polityka-prywatnosci"
                    className="text-xs inline"
                >
                    Regulamin i Politykę Prywatności.
                </Link>
            </div>
        </Form>
     );
}
 
export default RegisterForm;