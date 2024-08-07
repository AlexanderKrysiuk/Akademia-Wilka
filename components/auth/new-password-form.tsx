"use client"
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