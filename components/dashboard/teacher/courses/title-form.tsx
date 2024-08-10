"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditCourseTitleSchema } from "@/schemas/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import * as z from 'zod'

interface TitleFormProps {
    initialData: {
        id:string
        title:string
    }
}

const TitleForm = ({
    initialData
}: TitleFormProps) => {
    const [isPending, startTransition] = useTransition()

    const onSubmit = (values: z.infer<typeof EditCourseTitleSchema>) => {
        console.log(values)
    }

    const form = useForm<z.infer<typeof EditCourseTitleSchema>>({
        resolver: zodResolver(EditCourseTitleSchema)
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[2vh]">
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) =>(
                        <FormItem>
                            <FormControl>
                                <Input
                                    disabled={isPending}
                                    placeholder={initialData.title}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="flex justify-start space-y-[1vh]">
                    <Button type="submit" disabled={isPending}>
                        Zapisz
                    </Button>
                </div>
            </form>
        </Form>
    );
}
 
export default TitleForm;