"use client"

import { ResetPassword } from "@/actions/auth";
import { ResetPasswordSchema } from "@/schema/auth";
import { Alert, Button, Form, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

type FormFields = z.infer<typeof ResetPasswordSchema>

const ResetPasswordForm = () => {
    const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting } } = useForm<FormFields>({
        resolver: zodResolver(ResetPasswordSchema)
    })

    const submit: SubmitHandler<FormFields> = async (data) => {
        const result = await ResetPassword(data)
        if (result.error) {
            setError(result.error.field as keyof FormFields, { message: result.error.message })
            return
        } else {
            toast.success(result.success)
        }

    }
    
    return ( 
        <Form onSubmit={handleSubmit(submit)}>
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
                {isSubmitting ? "Przetwarzanie..." : "Resetuj hasło"}
            </Button>
        </Form>
     );
}
 
export default ResetPasswordForm;