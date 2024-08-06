"use client"
import { LoginSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import RenderResultMessage from "@/components/render-result-message";
import { Login } from "@/actions/auth/login";
import { useSearchParams } from "next/navigation";


const LoginForm = () => {
    const searchParams = useSearchParams();
    const [result, setResult] = useState<{ success: boolean, message: string} | null>(null)
    const [isPending, startTransition] = useTransition()
    const callbackUrl = searchParams.get("callbackUrl");

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema)
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setResult(null)
        startTransition(() => {
            Login(values, callbackUrl)
        })
    }
    
    return ( 
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[1vh]">
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
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hasło</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={isPending}
                                    placeholder="********"
                                    type="password"
                                />
                            </FormControl>
                            <Link href="/auth/reset" passHref>
                                <Button variant={`link`}>
                                    Nie pamiętasz hasła?
                                </Button>
                            </Link>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="flex justify-center space-y-[1vh]">
                    <Button type="submit" disabled={isPending}>
                        Zaloguj się
                    </Button>
                </div>
                {RenderResultMessage(result)}
            </form>
        </Form>  
    );
}
export default LoginForm;