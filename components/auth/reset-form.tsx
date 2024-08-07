"use client"
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
                    <Button disabled={isPending} type="submit" variant="link">
                        Zresetuj Hasło
                    </Button>
                </div>
                {RenderResultMessage(result)}
            </form>
        </Form>
    );
}
 
export default ResetForm;