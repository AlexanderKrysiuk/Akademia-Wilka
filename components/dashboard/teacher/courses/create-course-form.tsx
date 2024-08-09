"use client"
import RenderResultMessage from "@/components/render-result-message";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CreateCourseSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCurrentUser } from "@/hooks/user";

const CreateCourseForm = () => {
    const [isPending, startTransition] = useTransition()
    const [result, setResult] = useState<{ success: boolean, message: string} | null>(null)
    const user = useCurrentUser()

    const form = useForm<z.infer<typeof CreateCourseSchema>>({
        resolver: zodResolver(CreateCourseSchema)
    })

    const onSubmit = (values: z.infer<typeof CreateCourseSchema>) => {
            console.log(values)
        //     setResult(null)
    //     startTransition(()=>{
    //         create(values, user?.id as string)
    //             .then((data) => {
    //                 //setResult({ success: data.success, message: data.message })
    //             })
    //     })
    }

    return ( 
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) =>(
                        <FormItem>
                            <FormLabel>Tytuł</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isPending}
                                    placeholder="rocket sience"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}     
                />
                <div className="flex justify-center space-y-[1vh]">
                    <Button type="submit" disabled={isPending}>
                        Załóż Konto
                    </Button>
                </div>
            </form>
            {RenderResultMessage(result)}
        </Form>
    );
}
 
export default CreateCourseForm;