

// V1
import { unpublishLesson } from "@/actions/lesson-teacher/lesson"
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd"
import { Card, CardHeader } from "@nextui-org/react"
import { Chapter, Lesson, LessonType } from "@prisma/client"
import { Eye, EyeOff, Scroll } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import LessonEditModal from "./lesson-edit-modal"
import LessonDeleteModal from "./lesson-delete-modal"

//export const getRequiredFields = (lesson: Lesson) => {
//    const requiredFields = [
//        lesson.title,
//        ...(lesson.type !== LessonType.Subchapter ? [lesson.slug] : []), // Add slug for other types
//        ...(lesson.type === LessonType.Video && Array.isArray(lesson.media) && lesson.media.length === 0 ? [false] : []) // Check if it's an array
//    ]
//    return requiredFields 
//}

//const validateLessonFields = (lesson: Lesson) => {
//    const requiredFields = getRequiredFields(lesson);
//    return requiredFields.every(Boolean); // Sprawdzamy, czy wszystkie pola są wypełnione
//};

// Zmiana statusu publikacji na podstawie walidacji
//export const handlePublishingStatus = (lesson: Lesson) => {
//    const isValid = validateLessonFields(lesson);
//    if (!isValid && lesson.published) {
//        unpublishLesson(lesson.id); // Jeśli dane są niepełne, zmieniamy na szkic
//       toast.warning("Lekcja zmieniła status na szkic. Uzupełnij wszystkie pola.");
//    }
//};

const LessonCard = ({
    chapter,
    lesson,
    dragHandleProps,
    onUpdate
}: {
    chapter: Chapter;
    lesson: Lesson;
    dragHandleProps: DraggableProvidedDragHandleProps | null;
    onUpdate: () => void;
}) => {
    const [completedFieldsNumber, setCompletedFieldsNumber] = useState<number>(0);
    const [requiredFieldsNumber, setRequiredFieldsNumber] = useState<number>(0);

    const checkIfLessonCanBePublished = useCallback(async (lesson: Lesson) => {
        const requiredFields = [lesson.title, lesson.slug];

        const completedFields = requiredFields.filter(Boolean).length;

        if (completedFields < requiredFields.length && lesson.published) {
            await unpublishLesson(lesson.id)
                .then((data) => {
                    console.info(data);
                    toast.warning("Lekcja zmieniła status na szkic");
                })
                .catch((error) => {
                    console.error("[UNPUBLISH LESSON ERROR]", error);
                    toast.error(error || "Nastąpił nieoczekiwany błąd");
                })
                .finally(onUpdate);
        }
        setCompletedFieldsNumber(completedFields);
        setRequiredFieldsNumber(requiredFields.length);
    }, [onUpdate]);

    useEffect(() => {
        checkIfLessonCanBePublished(lesson);
    }, [lesson, checkIfLessonCanBePublished]);

    return (
        <Card>
            <CardHeader className="gap-x-2">
                <div {...dragHandleProps}>
                    <Scroll className="hover:text-primary transition duration-300" />
                </div>
                <div className="truncate w-full">{lesson.title}</div>
                <div className="text-sm">
                    {lesson.published ? <Eye /> : <EyeOff />}
                </div>
                {completedFieldsNumber}
                {requiredFieldsNumber}
                <LessonEditModal
                    chapter={chapter}
                    lesson={lesson}
                    requiredFieldsNumber={requiredFieldsNumber}
                    completedFieldsNumber={completedFieldsNumber}
                    onUpdate={onUpdate}
                />
                <LessonDeleteModal
                    lesson={lesson}
                    chapter={chapter}
                    onUpdate={onUpdate}
                />
            </CardHeader>
        </Card>
    );
};

export default LessonCard;


// const LessonCard = ({
//     chapter,
//     lesson,
//     dragHandleProps,
//     onUpdate
// }:{
//     chapter: Chapter
//     lesson: Lesson
//     dragHandleProps: DraggableProvidedDragHandleProps | null
//     onUpdate: () => void
// }) => {
//     const [completedFieldsNumber, setCompletedFieldsNumber] = useState<number>(0)
//     const [requiredFieldsNumber, setRequiredFieldsNumber] = useState<number>(0)

//     async function checkIfLessonCanBePublished(lesson: Lesson) {
//         const requiredFields = [
//             lesson.title,
//             lesson.slug
//         ]

//         const completedFields = requiredFields.filter(Boolean).length

//         if (completedFields < requiredFields.length && lesson.published) {
//             await unpublishLesson(lesson.id)
//                 .then((data)=>{
//                     console.info(data)
//                     toast.warning("Lekcja zmieniła status na szkic")
//                 })
//                 .catch((error)=>{
//                     console.error("[UNPUBLISH LESSON ERROR]", error)
//                     toast.error(error || "Nastąpił nieoczekiwany błąd")
//                 })
//                 .finally(onUpdate)
//         } 
//         setCompletedFieldsNumber(completedFields)
//         setRequiredFieldsNumber(requiredFields.length)
//     }

//     useEffect(()=>{
//         checkIfLessonCanBePublished(lesson)
//     }, [lesson])
//     // Check if mediaURLs is an array before checking its length
//     //const requiredFields = [
//     //    lesson.title,
//     //    ...(lesson.type !== LessonType.Subchapter ? [lesson.slug] : []), // Add slug for other types
//     //    ...(lesson.type === LessonType.Video && Array.isArray(lesson.media) && lesson.media.length === 0 ? [false] : []) // Check if it's an array
//     //]
//     //const completedFields = requiredFields.filter(Boolean).length

//     //const isValid = validateLessonFields(lesson); // Sprawdzamy, czy dane są poprawne

//     //useEffect(() => {
//     //    handlePublishingStatus(lesson); // Automatycznie zmieniamy status publikacji
//     //}, [lesson]);

//     return (
//         <Card>
//             <CardHeader className="gap-x-2">
//                 <div {...dragHandleProps}>
//                     <Scroll className="hover:text-primary transition duration-300"/>
//                 </div>
//                 <div className="truncate w-full">
//                     {lesson.title}
//                 </div>
//                 <div className="text-sm">
//                     {lesson.published ? (
//                         <Eye/>
//                     ) : (
//                         <EyeOff/>
//                     )}
//                 </div>
//                 {completedFieldsNumber}
//                 {requiredFieldsNumber}
//                 <LessonEditModal
//                     chapter={chapter}
//                     lesson={lesson}
//                     requiredFieldsNumber={requiredFieldsNumber}
//                     completedFieldsNumber={completedFieldsNumber}
//                     onUpdate={onUpdate}
//                 />
//                 <LessonDeleteModal
//                     lesson={lesson}
//                     chapter={chapter}
//                     onUpdate={onUpdate}
//                 />
//             </CardHeader>
//         </Card>
//     )
// }
// export default LessonCard
