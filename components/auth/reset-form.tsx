"use client"

import { reset } from "@/actions/auth/reset"
import { ResetSchema } from "@/schemas/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input } from "@heroui/react"
import { startTransition } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = z.infer<typeof ResetSchema>

const ResetForm = () => {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({ resolver: zodResolver(ResetSchema)})
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(async ()=>{
            reset(data)
                .then(()=>{
                    toast.success("Wysłano e-mail resetujący hasło!")
                })
                .catch((error)=>{
                    setError("email", { message: error.message })
                    toast.error(error.message)
                })
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xs w-full">
            <Input {...register("email")}
                label="E-mail"
                labelPlacement="outside"
                type="email"
                placeholder="jack.sparrow@pirate.com"
                isRequired
                isClearable
                disabled={isSubmitting}
                variant="bordered"
                isInvalid={errors.email ? true : false}
                errorMessage={errors.email?.message}
                autoComplete="email"
                className="max-w-xs mb-4"
            />
            <Button type="submit" color="primary" fullWidth disabled={isSubmitting} isLoading={isSubmitting}>
                {isSubmitting ? "Przetwarzanie..." : "Resetuj hasło"}
            </Button>
        </form>
    )
}
export default ResetForm;

{/* 
import { ResetSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTransition, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import RenderResultMessage from "../render-result-message";
import { reset } from "@/actions/auth/reset";

const ResetForm = () => {
    const [result, setResult] = useState<{ success: boolean, message: string} | null>(null)
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema)
    })

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setResult(null)
        startTransition(()=>{
            reset(values)
                .then((data) => {
                    setResult({ success: data.success, message: data.message })
                })
        })    }
    
    return ( 
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[1vh] py-[1vh]">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="john.doe@example.com"
                                    type="email"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="flex justify-center space-y-[1vh[">
                    <Button disabled={isPending} type="submit">
                        Zresetuj Hasło
                    </Button>
                </div>
                {RenderResultMessage(result)}
            </form>
        </Form>
    );
}
 
export default ResetForm;
*/}
