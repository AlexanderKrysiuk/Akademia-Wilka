// src/components/ui/DeleteAttachmentModal.tsx
import { deleteAttachmentByID } from "@/actions/course/attachments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Upewnij się, że poprawnie importujesz Card
import { toast } from "@/components/ui/use-toast";
import { Attachment } from "@prisma/client";
import { Loader } from "lucide-react";
import { startTransition, useTransition } from "react";

interface DeleteAttachmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    initialData: Attachment|undefined;
}

const DeleteAttachmentModal: React.FC<DeleteAttachmentModalProps> = ({
    isOpen,
    onClose,
    onUpdate,
    initialData
}) => {
    if (!isOpen || !initialData) return null;

    const [isPending, startTransition] = useTransition()

    const onSubmit = () => {
        if (!initialData.id) {
            toast({
                title: "❌ Błąd!",
                description: "Nie można usunąć załącznika, ponieważ brak identyfikatora.",
                variant: "failed",
            });
            return;
        }

        startTransition(()=>{
            deleteAttachmentByID(initialData.id)
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
                <CardHeader className="flex">
                    <CardTitle className="text-lg font-bold">Czy na pewno chcesz usunąć?</CardTitle>
                    {initialData?.name}
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
                            <span> Usuwanie załącznika...</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DeleteAttachmentModal;
