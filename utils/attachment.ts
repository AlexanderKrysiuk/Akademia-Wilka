import { toast } from "@/components/ui/use-toast";
import { uploadAttachmentToCourse } from "@/actions/file/upload-attachment-to-course"; // Upewnij się, że ścieżka jest poprawna

export const uploadAttachment = async (
    file: File,
    courseId: string,
    userId: string,
    fetchCourse: () => void,
    setAttachmentUploading: (value: boolean) => void
) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);
    formData.append("userId", userId);

    setAttachmentUploading(true);

    try {
        await uploadAttachmentToCourse(formData);
        toast({
            title: "✅ Sukces!",
            description: "Plik został przesłany!",
            variant: "success",
        });
        fetchCourse(); // Wywołanie po pomyślnym przesłaniu
    } catch (error) {
        toast({
            title: "❌ Błąd!",
            description: "Wystąpił błąd podczas przesyłania pliku.",
            variant: "failed",
        });
    } finally {
        setAttachmentUploading(false);
    }
};