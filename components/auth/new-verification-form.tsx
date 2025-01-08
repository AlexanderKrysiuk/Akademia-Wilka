"use client"

import { checkVerificationToken, setFirstPassword } from "@/actions/auth/new-verification";
import { useSearchParams } from "next/navigation";
import { startTransition, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle, Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import { Button, Input } from "@nextui-org/react";
import { NewPasswordSchema } from "@/schemas/user";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";

type FormFields = z.infer<typeof NewPasswordSchema>;

const NewVerificationForm = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const { register, handleSubmit, setError, setValue, formState: { errors, isSubmitting } } = useForm<FormFields>({ resolver: zodResolver(NewPasswordSchema)})
    const [result, setResult] = useState<{success: boolean, message: string} | null>()
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [verificationCompleted, setVerificationCompleted] = useState(false)
    const [email, setEmail] = useState<string>()

    if (!token) {
        setResult({success:false, message: "Nie znaleziono tokenu!"})
        throw new Error("Nie znaleziono tokenu!")
    }

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(async()=>{
            setFirstPassword(data, token)
            .then(()=>{
                toast.success("Nadano nowe hasło!")
                setResult({success: true, message: "Weryfikacja przebiegła pomyślnie"})
                setVerificationCompleted(true)
            })
            .catch((error)=>{
                setResult({ success:false, message: error.message})
            })
        })
    }

    const verifyToken = useCallback(async () => {
        try {
            const email = await checkVerificationToken(token)
            setEmail(email)
            setResult({success: true, message: "Weryfikacja przeszła pomyślnie!, możesz ustawić nowe hasło!"})
        } catch(error) {
            if (error instanceof Error){
                toast.error(error.message)
                setResult({success: false, message: error.message})
            } else {
                toast.error("Wystąpił nieznany błąd")
                setResult({success: false, message: "Wystąpił nieznany błąd" })
            }
        }
    }, [token]);

    useEffect(()=>{
        verifyToken()
    },[verifyToken])
    
    return ( 
        !result ? (
            <div className="w-full flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-primary"/>
                Weryfikacja tokenu...
            </div>
        ): result.success ? (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="E-mail"
                    labelPlacement="outside"
                    isRequired
                    value={email}
                    variant="bordered"
                    isDisabled // E-mail jest tylko do odczytu
                    autoComplete="email"
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
                    type={passwordVisible ? "text" : "password" }
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
                {verificationCompleted && 
                    <div className="text-primary w-full flex items-center text-sm gap-2 justify-center mb-4">
                        <CheckCircle/>
                        {result.message}
                    </div>
                } 
                <Button type={verificationCompleted ? "button" : "submit"} color="primary" fullWidth disabled={isSubmitting} isLoading={isSubmitting} className="space-y-0">
                    {verificationCompleted ? (
                        <Link href="/auth/start">
                            Przejdź do logowania
                        </Link>
                    ): (
                        isSubmitting ? "Przetwarzanie..." : "Ustaw hasło" 
                    )}
                </Button>
            </form>
        ) : (
            <div className="text-red-500 w-full flex items-center text-sm gap-2 justify-center mb-4">
                <TriangleAlert/>
                {result.message}
            </div>
        ) 
    );
}
 
export default NewVerificationForm;
