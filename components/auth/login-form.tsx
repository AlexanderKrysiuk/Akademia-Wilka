"use client";

import { LoginVerification } from "@/actions/auth/login";
import { LoginSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from 'zod'

type FormFields = z.infer<typeof LoginSchema>

interface LoginFormProps {
    onLogin?: (email: string) => void
    redirectUrl?: string
}

const LoginForm = ({
    onLogin,
    redirectUrl
}: LoginFormProps ) => {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({ resolver: zodResolver(LoginSchema )})
    const [passwordVisible, setPasswordVisible] = useState(false)
    {/* const router = useRouter() */}

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            await LoginVerification(data)

            // Jeśli weryfikacja zakończy się pomyślnie, wykonujemy logowanie
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password
            });

            // Sprawdzamy wynik logowania
            if (result?.error) {
                throw new Error();
            }

        // Logowanie zakończone sukcesem
        toast.success("Logowanie zakończone sukcesem!");

        if (onLogin) {
            onLogin(data.email); // Przekazanie emaila do onLogin
        }

        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
        
        } catch(error: any) {
            toast.error(error.message || "Wystąpił błąd podczas logowania");
        }
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
                className="max-w-s"
            />
            <Link href="/auth/reset" className="absolute right-4 text-sm text-primary transition-all duration-300 hover:underline pt-3">
                Nie pamiętasz hasła?
            </Link>
            <Input {...register("password")}
                id="password"
                label={"Hasło"}
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
                autoComplete="current-password"
                className="max-w-xs mb-4 pt-4"
            />
            <Button type="submit" color="primary" fullWidth disabled={isSubmitting} isLoading={isSubmitting}>
                Zaloguj
            </Button>
        </form>
    )

}

export default LoginForm;

{/* 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginSchema } from "@/schemas/user";
import { toast } from 'react-toastify'
import { checkVerificationEmail } from "@/actions/auth/check-verification-email";
import Link from "next/link";

interface LoginFormProps {
    onLogin?: (email: string) => void
}

const LoginForm = ({
    onLogin
}:LoginFormProps) => {
    const [isPending, setIsPending] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
    });
    
    {/* 
    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        
        setIsPending(true);
        await login(values);
        setIsPending(false);
        try {
            const result = await login(values);
            
            if (result.redirect) {
                if (result.url) {
                    router.push(result.url); // Automatyczne przekierowanie na bazie URL
                }
            } else {
                toast.success(result.message || "Logowanie udane!"); // Wyświetlenie komunikatu o weryfikacji e-maila
            }
        } catch (error) {
            toast.error("Błąd logowania!"); // Wyświetlenie komunikatu o błędzie logowania
        }
        
    };
*/}
{/*}
const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setIsPending(true);
    
    try {
        const respone = await checkVerificationEmail(values);
        
        if (respone?.message) {
            toast.info(respone.message)
            return
        }
        
        // E-mail jest zweryfikowany, przeprowadź logowanie
        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
        });
        
        if (result?.ok) {
            toast.success("Logowanie udane!");
            if (onLogin) {
                onLogin(values.email)
                }
            } else {
                toast.error("Błąd logowania!");
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message); // Wyświetl komunikat o błędzie
            } else {
                toast.error("Wystąpił nieznany błąd.");
            }
        } finally {
            setIsPending(false);
        }
    };
    
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="john.doe@example.com" type="email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center w-full">
                                <FormLabel>Hasło</FormLabel>
                                <Link href="/auth/reset">
                                    <Button variant="link">Nie pamiętasz hasła?</Button>
                                </Link>
                            </div>
                            <FormControl>
                                <Input {...field} placeholder="********" type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <Button type="submit" disabled={isPending}>
                    Zaloguj się
                </Button>
            </form>
        </Form>
    );
};

export default LoginForm;
*/}