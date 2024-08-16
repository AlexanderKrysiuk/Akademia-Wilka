"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Upewnij się, że poprawnie importujesz Card
import { toast } from "@/components/ui/use-toast";
import { Chapter } from "@prisma/client";
import { Loader, X, SquarePen } from "lucide-react";
import { startTransition, useTransition } from "react";
import { updateChapterByID } from "@/actions/course/chapter"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from 'zod'
import { EditChapterSchema } from "@/schemas/chapter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EditChapterFormProps {
    courseID: string;
    chapter: Chapter|undefined
    userID: string;
    onClose: () => void;
    onUpdate: () => void;
}

const EditChapterForm: React.FC<EditChapterFormProps> = ({
    courseID,
    chapter,
    userID,
    onClose,
    onUpdate,
}) => {
    if (!courseID || !chapter || !userID) return;

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof EditChapterSchema>>({
        resolver: zodResolver(EditChapterSchema),
        defaultValues: {
            title: chapter.title
        }
    })

    const onSubmit = (values: z.infer<typeof EditChapterSchema>) => {
        startTransition(()=>{
            updateChapterByID(values, chapter.id, userID, courseID)
                .then((data) =>{
                    toast({
                        title: data.success ? "✅ Sukces!" : "❌ Błąd!",
                        description: data.message,
                        variant: data.success? "success" : "failed",
                    });
                    if (data.success) {
                        onUpdate(); // Wywołaj onUpdate po udanej aktualizacji
                    }
                })
        })
    }
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <Card className="bg-background px-[1vw] py-[1vh]">
                <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center justify-between">
                        <CardTitle>Edycja rozdziału</CardTitle>
                        <Button
                            variant={`link`}
                            onClick={onClose}
                        >
                            <X/>
                        </Button>
                    </div>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[1vh]">
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>Tytuł</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isPending}
                                                placeholder={chapter.title}
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
                                    <Button type="submit" className="gap-x-[1vw]">
                                        <SquarePen/> Zmień tytuł rozdziału
                                    </Button>
                                </div>
                                {isPending && (
                                    <div className="flex items-center justify-center mt-2">
                                        <Loader className="animate-spin" />
                                        <span> Zmienianie tytułu rozdziału...</span>
                                    </div>
                                )}
                            </div>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default EditChapterForm;
