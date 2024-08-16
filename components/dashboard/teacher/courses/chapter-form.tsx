"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CreateChapterSchema } from "@/schemas/chapter"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader, SquarePlus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { useTransition } from "react"
import { createChapter } from "@/actions/course/chapter"
import { toast } from "@/components/ui/use-toast";


interface ChapterFormProps {
    initialData: {
        id: string
    }
    userID: string
    onUpdate: () => void
    onClose: () => void
}

const ChapterForm = ({
    initialData,
    userID,
    onUpdate,
    onClose
}: ChapterFormProps) => {
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof CreateChapterSchema>>({
        resolver: zodResolver(CreateChapterSchema)
    })

    const onSubmit = (values: z.infer<typeof CreateChapterSchema>) => {
        startTransition(()=>{
            createChapter(values, initialData.id, userID)
                .then((data) => {
                    toast({
                        title: data.success ? "✅ Sukces!" : "❌ Błąd!",
                        description: data.message,
                        variant: data.success? "success" : "failed",
                    });
                    if (data.success) {
                        onUpdate()
                    }
                })
        })
    }

    return ( 
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <Card className="bg-background px-[1vw] py-[1vh]">
                <CardHeader>
                    <div className="flex justify-between items-center w-full">
                        <CardTitle>
                            Dodaj tytuł rozdziału
                        </CardTitle>
                        <Button variant={`link`} onClick={onClose}>
                            <X/>
                        </Button>
                    </div>
                </CardHeader>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[1vh]">
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({field}) =>(
                                        <FormItem>
                                            <FormLabel>Tytuł</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isPending}
                                                    placeholder="Podstawy Dynamiki Lotu Rakietowego"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter>
                                <div className="flex flex-col items-center space-y-[1vh] w-full">
                                    <div className="justify-start w-full">
                                        <Button className="gap-x-[1vw]">
                                            <SquarePlus/> Dodaj Rozdział
                                        </Button>
                                    </div>
                                    {isPending && (
                                        <div className="flex items-center justify-center mt-2">
                                            <Loader className="animate-spin" />
                                            <span> Dodawanie rozdziału...</span>
                                        </div>
                                    )}
                                </div>
                            </CardFooter>
                        </form>
                    </Form>
            </Card>
        </div>
    );
}
 
export default ChapterForm;