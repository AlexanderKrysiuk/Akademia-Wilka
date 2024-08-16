"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Upewnij się, że poprawnie importujesz Card
import { toast } from "@/components/ui/use-toast";
import { Chapter } from "@prisma/client";
import { Loader } from "lucide-react";
import { startTransition, useTransition } from "react";
import { deleteChapterByID } from "@/actions/course/chapter"

interface DeleteChapterFormProps {
    courseID: string;
    chapter: Chapter|undefined
    userID: string;
    onClose: () => void;
    onUpdate: () => void;
}

const DeleteChapterForm: React.FC<DeleteChapterFormProps> = ({
    courseID,
    chapter,
    userID,
    onClose,
    onUpdate,
}) => {
    if (!courseID || !chapter || !userID) return;

    const [isPending, startTransition] = useTransition()

    const onSubmit = () => {
        startTransition(()=>{
            deleteChapterByID(chapter.id, userID, courseID)
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
                <CardHeader className="flex items-center">
                    <CardTitle>Czy na pewno chcesz usunąć?</CardTitle>
                    {chapter.title}
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center">
                        <Button variant="outline" onClick={onClose} disabled={isPending}>
                            Anuluj
                        </Button>
                        <Button variant="destructive" onClick={onSubmit} disabled={isPending}>
                            Usuń
                        </Button>
                    </div>
                    {isPending && (
                        <div className="flex items-center justify-center mt-2">
                            <Loader className="animate-spin" />
                            <span> Usuwanie rozdziału...</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DeleteChapterForm;
