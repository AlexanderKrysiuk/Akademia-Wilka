"use client"

import { checkPasswordResetToken, setAnotherPassword } from "@/actions/auth/new-password";
import { NewPasswordSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { CheckCircle, Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

type FormFields = z.infer<typeof NewPasswordSchema>

const NewPasswordForm = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormFields>({ resolver: zodResolver(NewPasswordSchema) })
    const [result, setResult] = useState<{success: boolean, message: string} | null>()
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [resetPasswordCompleted, setResetPasswordCompleted] = useState(false)
    const [email, setEmail] = useState<string>()

    if (!token) {
        setResult({success:false, message: "Nie znaleziono tokenu!"})
        throw new Error("Nie znaleziono tokenu!")
    }

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(async()=>{
            setAnotherPassword(data, token)
            .then(()=>{
                toast.success("Nadano nowe hasło!")
                setResult({success: true, message: "Zmiana hasła przebiegła pomyślnie"})
                setResetPasswordCompleted(true)
            })
            .catch((error)=>{
                setResult({ success: false, message: error.message})
            })
        })
    }

    const verifyToken = async () => {
        try {
            const email = await checkPasswordResetToken(token)
            setEmail(email)
            setResult({success: true, message: "Weryfikacja przeszła pomyślnie!, możesz ustawić nowe hasło!"})
        } catch(error) {
            if (error instanceof Error) {
                toast.error(error.message)
                setResult({success: false, message: error.message})
            } else {
                toast.error("Wystąpił nieznany błąd")
                setResult({success: false, message: "Wystąpił nieznany błąd" })
            }
        }
    }

    useEffect(()=>{
        verifyToken()
    },[token])

    return (
        !result ? (
            <div className="w-full flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-primary"/>
                Weryfikacja tokenu...
            </div>
        ) : result.success ? (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="E-mail"
                    labelPlacement="outside"
                    isRequired
                    value={email}
                    variant="bordered"
                    isDisabled
                    autoComplete="emaik"
                    className="max-w-xs mb-10"
                />
                <Input
                    {...register("password")}
                    label="Nowe hasło"
                    labelPlacement="outside"
                    placeholder="********"
                    endContent={
                        <Button isIconOnly type="button" variant="light" size="sm" className="flex items-center" onClick={() => setPasswordVisible((prev) => !prev)}>
                            {passwordVisible ? <Eye/> : <EyeOff/>}
                        </Button>
                    }
                    type={passwordVisible ? "text" : "password"}
                    isRequired
                    variant="bordered"
                    isInvalid={errors.password ? true : false}
                    errorMessage={errors.password?.message}
                    autoComplete="new-password"
                    className="max-w-xs mb-10"
                />
                <Input
                    {...register("confirmPassword")}
                    label="Potwierdź nowe hasło"
                    labelPlacement="outside"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="********"
                    endContent={
                        <Button isIconOnly type="button" variant="light" size="sm" className="flex items-center" onClick={() => setPasswordVisible((prev) => !prev)}>
                            {passwordVisible ? <Eye/> : <EyeOff/>}
                        </Button>
                    }
                    isRequired
                    variant="bordered"
                    isInvalid={errors.confirmPassword ? true : false}
                    errorMessage={errors.confirmPassword?.message}
                    autoComplete="new-password"
                    className="max-w-xs mb-4"
                />
                {resetPasswordCompleted &&
                    <div className="text-primary w-full flex items-center text-sm gap-2 justify-center mb-4">
                        <CheckCircle/>
                        {result.message}
                    </div>
                }
                <Button type={resetPasswordCompleted ? "button" : "submit"} color="primary" fullWidth disabled={isSubmitting || resetPasswordCompleted} isLoading={isSubmitting}>
                    {resetPasswordCompleted ? (
                        <Link href="/api/start">
                            Przejdź do logowania
                        </Link>
                    ) : (
                        isSubmitting ? "Przetwarzanie..." : "Ustaw nowe hasło"
                    )}
                </Button>
            </form>
        ) : (
            <div className="text-red-500 w-full flex items-center text-sm gap-2 justify-center mb-4">
            <TriangleAlert/>
                {result.message}
            </div>
        )
    )
}
export default NewPasswordForm;

{/* 
import { NewPasswordSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RenderResultMessage from "../render-result-message";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/auth/new-password";


const NewPasswordForm = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    
    const [result, setResult] = useState<{ success: boolean, message: string} | null>(null)
    const [isPending, startTransition] = useTransition()
    
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema)
    })

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setResult(null)
        startTransition(()=> {
            newPassword(values, token)
            .then((data) => {
                setResult({ success: data.success, message: data.message })
            })
        })
    }
    
    return ( 
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[1vh]">
        <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Nowe hasło</FormLabel>
            <FormControl>
            <Input
            {...field}
            disabled={isPending}
            placeholder="********"
            type="password"
            />
            </FormControl>
            <FormMessage/>
            </FormItem>
        )}
        />
        <div className="flex justify-center space-y-[1vh]">
        <Button type="submit" disabled={isPending}>
        Zmień hasło
        </Button>
        </div>
                {RenderResultMessage(result)}
                </form>
                </Form>
            );
        }
        
        export default NewPasswordForm;
    */}