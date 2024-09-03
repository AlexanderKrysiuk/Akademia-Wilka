"use client"
import { getAttachmentsByCourseID } from "@/actions/course/attachments";
import { uploadAttachmentToCourse } from "@/actions/file/upload-attachment-to-course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Attachment } from "@prisma/client";
import { FilePlus, File, X, Loader } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import DeleteAttachmentModal from "./delete-attachment-modal";

interface AttachmentFormProps {
    course: {
        id: string
    }
    userID: string
}

const AttachmentForm = ({
    course,
    userID,
}: AttachmentFormProps) => {
    const attachmentInputRef = useRef<HTMLInputElement | null>(null); // Ref do input file
    const [deleteAttachmentModal, setDeleteAttachmentModal] = useState(false)

    const [isPending, startTransition] = useTransition()
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [attachment, setAttachment] = useState<Attachment>()



    const fetchAttachments = async () => {
        const attachments = await getAttachmentsByCourseID(course.id)
        setAttachments(attachments || [])
    }

    useEffect(() => {
        fetchAttachments()
    }, [])


    const handleAddAttachmentClick = () => {
        if (attachmentInputRef.current) {
            attachmentInputRef.current.click(); // Kliknij ukryty input
        }
    };

    const handleAttachmentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            startTransition(()=>{
                const formData = new FormData()
                formData.append("file", file);
                formData.append("courseId", course.id)
                formData.append("userId", userID)
                uploadAttachmentToCourse(formData)
                    .then((data) => {
                        toast({
                            title: data.success ? "✅ Sukces!" : "❌ Błąd!",
                            description: data.message,
                            variant: data.success? "success" : "failed",
                        })
                        if(data.success) {
                            fetchAttachments();
                        }
                    })
            })
        }
    };

    const deleteAttachment = (attachment: Attachment) => {
        setAttachment(attachment);
        setDeleteAttachmentModal(true);
    };
    
    return (
        <Card>
            <CardHeader>
                <h2 className="justify-between w-full flex items-center">
                    Załączniki kursu
                    <Button
                        variant={`link`}
                        className="gap-x-[1vw]"
                        onClick={handleAddAttachmentClick}
                        disabled={isPending} // Wyłącz przycisk podczas przesyłania
                    >
                        <FilePlus /> Dodaj załącznik
                    </Button>
                </h2>
            </CardHeader>
            <CardContent className="w-full">
                {attachments.length > 0 ? (
                    attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-x-[1vw] justify-between">
                            <File/>
                            <a href={attachment.url} download className="text-primary truncate hover:underline">
                                {attachment.name}
                            </a>
                            <Button
                                variant="link"
                                className="text-red-500"
                                onClick={() => deleteAttachment(attachment)} // Otwórz modal po kliknięciu
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center bg-primary/10 rounded-md px-[1vw] py-[1vh]">
                        Brak załączników
                    </div>
                )}
                {isPending && (
                    <div className="flex items-center justify-center mt-2">
                        <Loader className="animate-spin" />
                        <span> Dodawanie załącznika...</span>
                    </div>
                )}
                {/* Dodaj input do wyboru pliku */}
                <input
                    type="file"
                    accept="*/*" // Akceptuj wszystkie typy plików
                    ref={attachmentInputRef} // Użyj referencji
                    style={{ display: 'none' }} // Ukrywamy input
                    onChange={handleAttachmentChange} // Obsłuż zmianę pliku
                />
                {/* Modal potwierdzenia usunięcia */}
                {deleteAttachmentModal && (
                    <DeleteAttachmentModal
                        isOpen={deleteAttachmentModal}
                        onClose={() => setDeleteAttachmentModal(false)}
                        onUpdate={()=>{
                            fetchAttachments()
                            setDeleteAttachmentModal(false)
                        }} // Przekazujemy funkcję do aktualizacji
                        initialData={attachment}
                />
            )}
            </CardContent>
        </Card>
    );
}
 
export default AttachmentForm;

