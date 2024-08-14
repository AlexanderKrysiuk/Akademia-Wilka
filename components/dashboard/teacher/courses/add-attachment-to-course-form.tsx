import React, { useState, useRef, startTransition } from "react";
import { uploadAttachmentToCourse } from "@/actions/file/upload-attachment-to-course";
import { toast } from "@/components/ui/use-toast";

interface AddAttachmentToCourseFormProps {
    initialData: {
        id: string;   
    },
    userID: string,
    onUploadComplete: () => void; // Funkcja wywoływana po zakończeniu przesyłania
}

const AddAttachmentToCourseForm = ({
    initialData, 
    userID,
    onUploadComplete
}: AddAttachmentToCourseFormProps ) => {
    const [uploading, setUploading] = useState<boolean>(false); // Typ boolean

    // Funkcja wywoływana, gdy plik zostanie wybrany
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file); // Dodanie pliku
            formData.append('courseId', initialData.id); // Dodanie ID kursu
            formData.append('userId', userID); // Dodanie ID użytkownika

            try {
                startTransition(()=> {
                    //await uploadCourseImage(formData); // Zaktualizuj tę funkcję w zależności od tego, jak wysyłasz obrazek
                    uploadAttachmentToCourse(formData)
                        .then(() => {
                            toast({
                                title: "✅ Sukces!",
                                description: "Zdjęcie zostało przesłane!",
                                variant: "success",
                            });
                            onUploadComplete(); // Wywołanie onUpdate po pomyślnym przesłaniu
                        })
                        .catch((error) => {
                            toast({
                                title: "❌ Błąd!",
                                description: "Wystąpił błąd podczas przesyłania zdjęcia.",
                                variant: "failed",
                            });
                        });
                })
            } catch (error) {
                toast({
                    title: "❌ Błąd!",
                    description: "Wystąpił błąd podczas przesyłania zdjęcia.",
                    variant: "failed",
                });
            }
        }
    };

    return (
        <div className="flex flex-col">
            <input
                type="file"
                accept="*/*" // Akceptuj wszystkie typy plików lub dostosuj według potrzeb
                onChange={handleFileChange}
                style={{ display: 'none' }} // Ukrywamy input
            />
        </div>
    );
};

export default AddAttachmentToCourseForm;
