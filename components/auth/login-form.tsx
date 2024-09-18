"use client";

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
    onLogin?: () => void
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
                    onLogin()
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