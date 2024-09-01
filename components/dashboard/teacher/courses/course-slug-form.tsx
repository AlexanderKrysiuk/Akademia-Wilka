"use client"

import { updateCourseSlug } from "@/actions/course/course"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EditSlugSchema } from "@/schemas/course"
import { zodResolver } from "@hookform/resolvers/zod"
import { Value } from "@radix-ui/react-select"
import { SquarePen } from "lucide-react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as z from 'zod'

interface CourseSlugFormProps {
    course: {
        id:string
        slug:string
    }
    userID:string
    onUpdate: () => void
}

export const CourseSlugForm = ({
    course,
    userID,
    onUpdate
}: CourseSlugFormProps) => {
    const [editSlug, setEditSlug] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof EditSlugSchema>>({
        resolver: zodResolver(EditSlugSchema),
        defaultValues: {
            slug: course.slug || ""
        }
    })

    const onSubmit = (values: z.infer<typeof EditSlugSchema>) => {
        startTransition(async () => {
            try {
                updateCourseSlug(values, userID, course.id)
                toast.success("Zaktualizowano odnośnik!")
                setEditSlug(false)
                onUpdate()
            } catch (error) {
                toast.error("Nie udało się zaktualizować odnośnika!")
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <h2 className="justify-between w-full flex items-center">
                    Unikalny odnośnik
                <Button
                    variant={`link`}
                    className="gap-x-[1vw]"
                    onClick={()=>{
                        setEditSlug(prev => !prev)
                    }}
                    >
                    {!editSlug && <SquarePen/>}
                    {editSlug ? "Anuluj" : "Edytuj unikalny odnośnik"}
                </Button>
                </h2>
            </CardHeader>
            <CardContent className="w-full">
                {editSlug ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[2vh]">
                            <FormField
                                control={form.control}
                                name="slug"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={isPending}
                                                placeholder={course.slug}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                        <FormDescription>
                                            Twój kurs musi posiadać unikaly odnośnik, który będzie wyświetlany pod linkiem /kurs/[Twój odnośnik]/
                                        </FormDescription>
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
                ):(
                    <h3>{course.slug}</h3>
                )}
            </CardContent>
        </Card>
    )
}