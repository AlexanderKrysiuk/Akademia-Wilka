"use client"
import { getCourseById } from "@/actions/course/get";
import { useCurrentUser } from "@/hooks/user";
import { Category, Course, Level, Attachment } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, startTransition } from "react";
import { ImageIcon, Settings, SquarePen, SquarePlus, File, FilePlus, Loader } from 'lucide-react';
import TitleForm from "@/components/dashboard/teacher/courses/title-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DescriptionForm from "@/components/dashboard/teacher/courses/description-form";
import ImageCropper from "@/components/image-cropper";
import CategoryForm from "@/components/dashboard/teacher/courses/category-form";
import { getCategoryByID } from "@/actions/course/category"; // Dodaj tę funkcję, aby pobrać kategorię
import { getLevelByID } from "@/actions/course/level";
import LevelForm from "@/components/dashboard/teacher/courses/level-form";
import PriceForm from "@/components/dashboard/teacher/courses/price-form";
import { formatPrice } from "@/lib/format";
import { getAttachmentsByCourseId } from "@/actions/course/attachments";
import AddAttachmentToCourseForm from "@/components/dashboard/teacher/courses/add-attachment-to-course-form";
import { toast } from "@/components/ui/use-toast";
import { uploadAttachmentToCourse } from "@/actions/file/upload-attachment-to-course";


const CourseIdPage = ({
    params
}: {
    params: { courseId: string }
}) => {
    const user = useCurrentUser();
    const router = useRouter();
    const [course, setCourse] = useState<Course>();
    const [editTitle, setEditTitle] = useState(false);
    const [editDescription, setEditDescription] = useState(false);
    const [editImage, setEditImage] = useState(false);
    const [editCategory, setEditCategory] = useState(false)
    const [editLevel, setEditLevel] = useState(false)
    const [editPrice, setEditPrice] = useState(false)
    const [editAttachment, setEditAttachment] = useState(false)
    const [attachmentUploading, setAttachmentUploading] = useState(false); // Stan do monitorowania przesyłania pliku
    const [selectedImage, setSelectedImage] = useState<File | null>(null); // Stan do przechowywania wybranego pliku
    const [category, setCategory] = useState<Category | null>(null); // Stan do przechowywania kategorii
    const [level, setLevel] = useState<Level | null>(null); // Stan do przechowywania poziomu
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref do input file
    const attachmentInputRef = useRef<HTMLInputElement | null>(null); // Ref do input file


    if (!user) {
        router.push("/");
        return;
    }

    if (!user.id){
        router.push("/");
        return;
    }

    if (!user?.role?.teacher) {
        router.push("/");
        return;
    }

    const fetchCourse = async () => {
        const course = await getCourseById(params.courseId);
        if (!course) {
            router.push("/");
            return;
        }
        setCourse(course);

        if (course.categoryId) {
            const fetchedCategory = await getCategoryByID(course.categoryId)
            setCategory(fetchedCategory || null)
        } else {
            setCategory(null)
        }

        if (course.levelId) {
            const fetchedLevel = await getLevelByID(course.levelId)
            setLevel(fetchedLevel || null)
        } else {
            setLevel(null)
        }

        const attachments = await getAttachmentsByCourseId(course.id);
        setAttachments(attachments || []);
    };

    useEffect(() => {
        fetchCourse();
    }, []);

    useEffect(() => {
        if (course && user) {
            if (course.ownerId !== user.id) {
                router.push("/");
            }
        }
    }, [course, user, router]);

    if (!course) {
        return <div>Ładowanie</div>;
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.levelId
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    // Funkcja do otwierania okna wyboru pliku
    const handleEditImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Funkcja obsługująca zmianę pliku
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedImage(file); // Ustaw wybrany plik
            setEditImage(true); // Otwórz edycję obrazka
        }
    };
    
    const handleAddAttachmentClick = () => {
        if (attachmentInputRef.current) {
            attachmentInputRef.current.click(); // Kliknij ukryty input
        }
    };

    const handleAttachmentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setAttachmentUploading(true);
    
            const formData = new FormData();
            formData.append('file', file); // Dodanie pliku
            formData.append('courseId', course.id); // Dodanie ID kursu
            formData.append('userId', user.id); // Dodanie ID użytkownika
    
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
                            setAttachmentUploading(false)
                            fetchCourse()// Wywołanie onUpdate po pomyślnym przesłaniu
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
        <div className="w-full px-[1vw] py-[1vh] space-y-[1vh] mb-[10vh]">
            <Card className="py-[1vh] px-[1vw] w-full">
                <CardHeader>
                    <CardTitle>
                        <h1 className="flex gap-x-[1vw]"><Settings /> Ustawienia Kursu {completionText}</h1>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    Uzupełnij wszystkie wymagane pola {completionText}
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[1vw] gap-y-[1vh]">
                <Card className="py-[1vh] px-[1vw] w-full">
                    <CardHeader>
                        <h2 className="justify-between w-full flex items-center">
                            Tytuł kursu
                            <Button
                                variant={`link`}
                                className="gap-x-[1vw]"
                                onClick={() => {
                                    setEditTitle(prev => !prev);
                                }}
                            >
                                {!editTitle && <SquarePen />}
                                {editTitle ? "Anuluj" : "Edytuj tytuł"}
                            </Button>
                        </h2>
                    </CardHeader>
                    <CardContent className="w-full">
                        {editTitle ? (
                            <TitleForm
                                initialData={course}
                                userID={user.id}
                                onUpdate={() => {
                                    fetchCourse();
                                    setEditTitle(false);
                                }}
                            />
                        ) : (
                            <h3>{course.title}</h3>
                        )}
                    </CardContent>
                </Card>
                <Card className="py-[1vh] px-[1vw] w-full">
                    <CardHeader>
                        <h2 className="justify-between w-full flex items-center">
                            Opis kursu
                            <Button
                                variant={`link`}
                                className="gap-x-[1vw]"
                                onClick={() => {
                                    setEditDescription(prev => !prev);
                                }}
                            >
                                {!editDescription && <SquarePen />}
                                {editDescription ? "Anuluj" : "Edytuj opis"}
                            </Button>
                        </h2>
                    </CardHeader>
                    <CardContent className="w-full">
                        {editDescription ? (
                            <DescriptionForm
                                initialData={course}
                                userID={user.id}
                                onUpdate={() => {
                                    fetchCourse();
                                    setEditDescription(false);
                                }}
                            />
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: course.description || "Brak opisu..." }} />
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="justify-between w-full flex items-center">
                            Obrazek kursu
                            <Button
                                variant={`link`}
                                className="gap-x-[1vw]"
                                onClick={handleEditImageClick} // Otwórz okno wyboru pliku
                            >
                                {course.imageUrl ? (
                                    <div className="flex items-center gap-x-[1vw]">
                                        <SquarePen/> Zmień Obraz
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-x-[1vw]">
                                        <SquarePlus /> Dodaj obraz
                                    </div>
                                )}
                            </Button>
                        </h2>
                    </CardHeader>
                    <CardContent className="w-full">
                        {course.imageUrl ? (
                            <img src={course.imageUrl} alt="Course Image" className="rounded-md" />
                        ) : (
                            <div className="h-[20vh] flex items-center justify-center bg-primary/10 rounded-md">
                                <ImageIcon className="h-[5vh] w-[5vh]" />
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="h-auto w-full">
                    <CardHeader>
                        <h2 className="justify-between w-full flex items-center">
                            Kategoria kursu
                            <Button
                                variant={`link`}
                                className="gap-x-[1vw]"
                                onClick={() => {
                                    setEditCategory(prev => !prev);
                                }}
                            >
                                {!editCategory && <SquarePen />}
                                {editCategory ? "Anuluj" : "Edytuj kategorię"}
                            </Button>
                        </h2>
                    </CardHeader>
                    <CardContent className="w-full">
                        {editCategory ? (
                            <CategoryForm
                                initialData={course}
                                userID={user.id}
                                onUpdate={() => {
                                    fetchCourse()
                                    setEditCategory(false)
                                }}
                            />
                        ) : (
                            <div>
                                {category ? category.name : "Brak kategorii"}
                            </div>
                        
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="justify-between w-full flex items-center">
                            Poziom kursu
                            <Button
                                variant={`link`}
                                className="gap-x-[1vw]"
                                onClick={() => {
                                    setEditLevel(prev => !prev);
                                }}
                            >
                                {!editLevel && <SquarePen />}
                                {editLevel ? "Anuluj" : "Edytuj poziom"}
                            </Button>
                        </h2>
                    </CardHeader>
                    <CardContent className="w-full">
                        {editLevel ? (
                            <LevelForm
                                initialData={course}
                                userID={user.id}
                                onUpdate={() => {
                                    fetchCourse()
                                    setEditLevel(false)
                                }}
                            />
                        ) : (
                            <div>
                                {level ? level.name : "Brak poziomu"}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                <CardHeader>
                        <h2 className="justify-between w-full flex items-center">
                            Cena kursu
                            <Button
                                variant={`link`}
                                className="gap-x-[1vw]"
                                onClick={() => {
                                    setEditPrice(prev => !prev);
                                }}
                            >
                                {!editPrice && <SquarePen />}
                                {editPrice ? "Anuluj" : "Edytuj cenę"}
                            </Button>
                        </h2>
                    </CardHeader>
                    <CardContent className="w-full">
                        {editPrice ? (
                            <PriceForm
                                initialData={course}
                                userID={user.id}
                                onUpdate={() => {
                                    fetchCourse()
                                    setEditPrice(false)
                                }}
                            />
                        ) : (
                            <div>
                                {course.price ? formatPrice(course.price) : "Kurs bezpłatny"}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                    <h2 className="justify-between w-full flex items-center">
                            Załączniki kursu
                            <Button
                                variant={`link`}
                                className="gap-x-[1vw]"
                                onClick={handleAddAttachmentClick}
                                disabled={attachmentUploading} // Wyłącz przycisk podczas przesyłania
                            >
                            <FilePlus /> Dodaj załącznik
                        </Button>
                        </h2>
                    </CardHeader>
                    <CardContent className="w-full">
                        {attachments.length > 0 ? (
                            attachments.map((attachment) => (
                                <div key={attachment.id} className="flex items-center gap-x-[1vw]">
                                    <File/>
                                    <a href={attachment.url} download className="text-primary truncate hover:underline">
                                        {attachment.name}
                                    </a>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center bg-primary/10 rounded-md px-[1vw] py-[1vh]">
                                Brak załączników
                            </div>
                        )}
                        {attachmentUploading && (
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
                    </CardContent>
                </Card>
            </div>
            {/* Ukryty input do wyboru pliku */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }} // Ukryj input
                onChange={handleFileChange} // Obsłuż zmianę pliku
            />
            {editImage && selectedImage && ( // Przekaż wybrany obraz do ImageCropper
                <ImageCropper
                    onCancel={() => {
                        setEditImage(false);
                        setSelectedImage(null); // Resetuj wybrany plik
                    }}
                    courseId={params.courseId} // Dodaj id kursu
                    userId={user.id} // Dodaj id użytkownika
                    imageFile={selectedImage} // Przekaż wybrany plik do croppera
                    onUpdate={() => {
                        fetchCourse();
                        setEditImage(false);
                    }}
                />
            )}
        </div>
    );
};
export default CourseIdPage;