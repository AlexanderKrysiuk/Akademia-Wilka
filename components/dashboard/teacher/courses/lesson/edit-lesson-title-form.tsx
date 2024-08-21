"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { EditLessonTitleSchema } from "@/schemas/lesson"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lesson, LessonType } from "@prisma/client"
import { SquarePen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { toast } from "@/components/ui/use-toast"
import { updateLessonTitle } from "@/actions/course/lesson"

interface EditLessonTitleFormProps {
    userID: string
    lesson: Lesson | undefined
    onClose: () => void
    onUpdate: () => void
}

const EditLessonTitleForm = ({
    userID,
    lesson,
    onClose,
    onUpdate
} : EditLessonTitleFormProps) => {
    if (!userID || !lesson) return

    const [editTitle, setEditTitle] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof EditLessonTitleSchema>>({
        resolver: zodResolver(EditLessonTitleSchema),
        defaultValues: {
            title: lesson.title
        }
    })

    const onSubmit = (values: z.infer<typeof EditLessonTitleSchema>) => {
        startTransition(()=>{
            updateLessonTitle(values, userID, lesson.id)
            .then((data)=>{
                toast({
                    title: data.success ? "✅ Sukces!" : "❌ Błąd!",
                    description: data.message,
                    variant: data.success? "success" : "failed",
                })
                if (data.success) {
                    setEditTitle(false)
                }
            })
        })
    }

    return (
        <Card>
            <CardHeader>
                <h2 className="flex items-center justify-between">
                    tytuł {lesson.type === LessonType.Subchapter ? "podrozdział" : "lekcję" }
                    <Button
                        variant={`link`}
                        className="gap-x-[1vw]"
                        onClick={() => {
                            setEditTitle(prev => !prev)
                        }}
                    >
                        {!editTitle && <SquarePen/> }
                        {editTitle ? "Anuluj" : "Edytuj" }
                    </Button>
                </h2>
            </CardHeader>
            <CardContent className="w-full">
                {editTitle ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[2vh]">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field})=>(
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={isPending}
                                                placeholder={lesson.title}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-start space-y-[1vh]">
                                <Button disabled={isPending}>
                                    Zapisz
                                </Button>
                            </div>
                        </form>
                    </Form>
                ) : (
                    <h3>{lesson.title}</h3>
                )}

            </CardContent>
        </Card>
    )
} 
export default EditLessonTitleForm;