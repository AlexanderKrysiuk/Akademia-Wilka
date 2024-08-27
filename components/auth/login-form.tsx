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

const LoginForm = () => {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setIsPending(true);

        // Wywołaj `signIn` z `redirect: true`, aby przekierować po zalogowaniu
        const result = await signIn("credentials", {
            redirect: true,
            email: values.email,
            password: values.password,
            callbackUrl: "/kokpit" // Ustaw swój URL docelowy tutaj
        });

        if (result?.url) {
            toast.success("Logowanie udane!"); // Wyświetlenie powiadomienia o sukcesie
            router.push(result.url); // Automatyczne przekierowanie na bazie URL z `signIn`
        } else {
            toast.error("Błąd logowania!"); // Wyświetlenie powiadomienia o błędzie
        }

        setIsPending(false);
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
                            <FormLabel>Hasło</FormLabel>
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