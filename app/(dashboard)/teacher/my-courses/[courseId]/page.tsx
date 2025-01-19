import { auth } from "@/auth"
import CategoryCard from "@/components/Course-Create/Course/category-card"
import ContentCard from "@/components/Course-Create/Course/content-card"
import DescriptionCard from "@/components/Course-Create/Course/description-card"
import ImageCard from "@/components/Course-Create/Course/image-card"
import LevelCard from "@/components/Course-Create/Course/level-card"
import PriceCard from "@/components/Course-Create/Course/price-card"
import PublishButton from "@/components/Course-Create/Course/publish-button"
import SlugCard from "@/components/Course-Create/Course/slug-card"
import SubjectCard from "@/components/Course-Create/Course/subject-card"
import TitleCard from "@/components/Course-Create/Course/title-card"
import { prisma } from "@/lib/prisma"
import { Card, CardBody, CardFooter, CardHeader, Progress } from "@heroui/react"
import { UserRole } from "@prisma/client"
import { Settings } from "lucide-react"
import { toast } from "react-toastify"


const CourseIdPage = async ({
    params
}:{
    params: { courseId: string }
}) => {
    const session = await auth()
    const user = session?.user

    if (!user || !user.role.includes(UserRole.Admin) || !user.role.includes(UserRole.Teacher)) throw new Error("User not found or unauthorized")

    const course = await prisma.course.findUnique({
        where: { id: params.courseId },
        include: {
            lessons: {
                orderBy: {
                    order: "asc"
                }
            }
        }
    })

    if (!course) throw new Error("Course not found")

    if (course.ownerId !== user.id && !user.role.includes(UserRole.Admin)) throw new Error("You are not authorized to edit this course");

    const { lessons } = course

    const requiredFields = [
        course.title,
        course.slug,
        course.imageUrl,
        course.description,
        course.category,
        course.level,
        course.subject,
        lessons.some((lesson) => lesson.published)
    ]

    const completedFields = requiredFields.filter(Boolean).length
    
    if (completedFields < requiredFields.length && course.published) {
        await prisma.course.update({
            where: { id: course.id },
            data: { published: false } 
        })
    }

    return (
        <main className="flex flex-col space-y-4">
            {JSON.stringify(course,null,2)}
            <Card>
                <CardHeader className="flex justify-between">
                    <div className="flex">
                        <Settings/>
                        {course.title}
                    </div>
                    <PublishButton 
                        courseId={course.id} 
                        published={course.published} 
                        completedFields={completedFields} 
                        requiredFields={requiredFields.length}                    
                    />
                </CardHeader>
                <CardBody>
                    <Progress
                        label={`(${completedFields}/${requiredFields.length})`}
                        value={completedFields / requiredFields.length * 100}
                        showValueLabel={true}
                        color={completedFields / requiredFields.length === 1 ? "success" : "warning"} 
                    />
                </CardBody>
                <CardFooter>
                    
                </CardFooter>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <TitleCard
                        courseId={course.id}
                        title={course.title}
                    />
                    <SlugCard
                        courseId={course.id}
                        slug={course.slug}
                    />
                    <DescriptionCard
                        courseId={course.id}
                        description={course.description}
                    />
                    <ImageCard
                        courseId={course.id}
                        imageUrl={course.imageUrl}
                    />
                    <CategoryCard
                        courseId={course.id}
                        userId={user.id}
                        category={course.category}
                    />
                    <LevelCard
                        courseId={course.id}
                        userId={user.id}
                        level={course.level}
                    />
                    <SubjectCard
                        courseId={course.id}
                        userId={user.id}
                        subject={course.subject}
                    />
                    <PriceCard
                        courseId={course.id}
                        price={course.price}
                    />
                </div>
                <div>
                    <ContentCard
                        courseId={course.id}
                        lessons={lessons}
                    />
                </div>
            </div>
        </main>
    )
}
export default CourseIdPage





// "use client"
// import { useCurrentUser } from "@/hooks/user";
// import { Course, Chapter, Category, UserRole, Level } from "@prisma/client";
// import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
// import { Settings } from 'lucide-react';
// import { GetMyCreatedCourse, unpublishCourse } from "@/actions/course-teacher/course";
// import PageLoader from "@/components/page-loader";
// import { Button, Card, CardBody, CardFooter, CardHeader, Progress } from "@heroui/react";
// import TitleCard from "@/components/Course-Create/Course/title-card";
// import SlugCard from "@/components/Course-Create/Course/slug-card";
// import ImageCard from "@/components/Course-Create/Course/image-card";
// import { toast } from "react-toastify";
// import PublishButton from "@/components/Course-Create/Course/publish-button";
// import CategoryCard from "@/components/Course-Create/Course/category-card";
// import LevelCard from "@/components/Course-Create/Course/level-card";
// import PriceCard from "@/components/Course-Create/Course/price-card";
// import { GetChaptersByCourseId } from "@/actions/chapter-teacher/chapter";
// import ChapterList from "@/components/Course-Create/Chapter/chapter-list";
// import SubjectCard from "@/components/Course-Create/Course/subject-card";


// const CourseIdPage = ({
//     params
// } : {
//     params: { courseId: string }
// }) => {
//     const user = useCurrentUser();        
//     const [course, setCourse] = useState<Course>();
//     const [chapters, setChapters] = useState<Chapter[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [requiredFieldsNumber, setRequiredFieldsNumber] = useState<number>(0)
//     const [completedFieldsNumber, setCompletedFieldsNumber] = useState<number>(0)
//     //const [dataReady, setDataReady] = useState(false)
    

//     //const requiredFields = useMemo(() => (
//     //    course ? [
//     //        course.title,
//     //        course.slug,
//     //        course.imageUrl,
//     //        course.category,
//     //        course.level,
//     //        course.subject,
//     //        chapters.some(chapter => chapter.published)
//     //    ] : []
//     //), [course, chapters]);
//     //const completedFields = requiredFields.filter(Boolean).length;

//     const checkIfCourseCanBePublished = useCallback(async (course: Course, chapters: Chapter[]) => {
//         const requiredFields = [
//             course.title,
//             course.slug,
//             course.imageUrl,
//             course.category,
//             course.level,
//             course.subject,
//             chapters.some(chapters => chapters.published)
//         ];
//         const completedFields = requiredFields.filter(Boolean).length;
    
//         if (completedFields < requiredFields.length && course.published) {
//             try {
//                 await unpublishCourse(course.id)
//                     .then(()=>{
//                         course.published=false
//                     })
//                 toast.warning("Kurs zmienił status na szkic");
//             } catch (error) {
//                 console.error("[UNPUBLISH COURSE ERROR]:", error);
//                 toast.warning("Nastąpił nieoczekiwany błąd");
//             }
//         }
    
//         setCompletedFieldsNumber(completedFields);
//         setRequiredFieldsNumber(requiredFields.length);
//     }, []);

//     const fetchCourseAndChapter = useCallback(async () => {
//         try {
//             const courseData = await GetMyCreatedCourse(params.courseId);
//             setCourse(courseData);

//             const chapterData = await GetChaptersByCourseId(params.courseId);
//             setChapters(chapterData);

//             checkIfCourseCanBePublished(courseData, chapterData);

//         } catch (error) {
//             console.log("[FETCH COURSE AND CHAPTER ERROR]:", error);
//             toast.error("Nie udało się pobrać danych o kursie lub rozdziałach");
//         } finally {
//             setLoading(false)
//         }
//     }, [params.courseId, checkIfCourseCanBePublished]);  // dependencies array, ensuring that the function is only recreated when the courseId changes
    

//     useEffect(() => {
//         fetchCourseAndChapter();
//     }, [fetchCourseAndChapter]);  // Now `fetchCourseAndChapter` is stable and will not trigger unnecessary rerenders

//     // async function fetchCourseAndChapter2 () {
//     //     await GetMyCreatedCourse(params.courseId)
//     //     .then((data)=>setCourse(data))
//     //         .catch((error)=>{
//     //             console.log("[GET MY CREATED COURSE ERROR]:",error)
//     //             toast.error(error || "Nie udało się pobrać danych o kursie")
//     //         })
//     //     await GetChaptersByCourseId(params.courseId)
//     //         .then((data)=>setChapters(data))
//     //         .catch((error)=>{
//     //             console.log("[GET CHAPTERS BY COURSE ID ERROR]:",error)
//     //             toast.error(error || "Nie udało się pobrać danych o rozdziałach")
//     //         })
//     //         setLoading(false)
    

//     //     //try {
//     //     //    const fetchedCourse = await GetMyCreatedCourse(params.courseId)
//     //     //    const fetchedChapters = await GetChaptersByCourseId(params.courseId)
//     //     //    setCourse(fetchedCourse)
//     //     //    setChapters(fetchedChapters)
//     //     //} catch (error) {
//     //     //    console.error(error)
//     //     //    toast.error("Nie udało pobrać się danych o kursie")
//     //     //} finally {

//     //     //}
//     // }

//     //useEffect(()=>{
//     //    fetchCourseAndChapter()
//     //},[])

//     //const fetchCourseData = useCallback(async () => {
//         //if(!user) return

//         //setLoading(true)
//     //    try {
//     //        const [fetchedCourse, fetchedChapters] = await Promise.all([
//     //            GetMyCreatedCourse(params.courseId),
//     //            GetChaptersByCourseId(params.courseId),
//     //        ])
//             //if (fetchedCourse.ownerId !== user.id && !user.role.includes(UserRole.Admin)) {
//             //    return
//             //}
//             // if (completedFields < requiredFields.length && fetchedCourse.published) {
//             //     await unpublishCourse(fetchedCourse.id)
//             //     toast.warning(
//             //         "Kurs zmienił status na: szkic. Uzupełnij wszystkie pola, by go opublikować."
//             //     );
//             // }
//     //            setCourse(fetchedCourse)
//     //            setChapters(fetchedChapters)
//     //    } catch(error) {
//     //        console.error("Error fetching data:", error);
//     //    } finally {
//     //        setLoading(false)
//     //    }
//     //}, [user, params.courseId, completedFields, requiredFields])




//     // useEffect(()=>{
//     //     if (dataReady && course) checkIfCourseCanBePublished(course, chapters)
//     // },[course, chapters])
   
       
   

//     //useEffect(()=>{
//     //    if (loading) fetchCourseData()
//     //}, [loading, fetchCourseData])

//     if (loading) {
//         return <PageLoader/>
//     }

//     if (!course || !user) {
//         return <div> Brak danych o kursie </div>
//     }

//     return (
//         <main className="w-full">
//             <Card className="mb-4">
//                 <CardHeader className="w-full justify-between">
//                     <div className="flex">
//                         <Settings/>
//                         {course.title}
//                     </div>
//                     <div>
//                         <PublishButton
//                             courseId={course.id}
//                             published={course.published}
//                             onUpdate={fetchCourseAndChapter}
//                             completedFields={completedFieldsNumber}
//                             requiredFields={requiredFieldsNumber}
//                         />
//                     </div>
//                 </CardHeader>
//                 <CardBody>
//                     <Progress
//                         label={`(${completedFieldsNumber}/${requiredFieldsNumber})`}
//                         value={completedFieldsNumber / requiredFieldsNumber * 100}
//                         showValueLabel={true}
//                         color={completedFieldsNumber / requiredFieldsNumber === 1 ? "success" : "warning"} 
//                     />
//                 </CardBody>
//             </Card>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-4">
//                     <TitleCard
//                         courseId={course.id}
//                         title={course.title}
//                         onUpdate={fetchCourseAndChapter}
//                     />
//                     <SlugCard
//                         courseId={course.id}
//                         slug={course.slug}
//                         onUpdate={fetchCourseAndChapter}
//                     />
//                     <ImageCard
//                         courseId={course.id}
//                         imageUrl={course.imageUrl}
//                         onUpdate={fetchCourseAndChapter}
//                     />
//                     <CategoryCard
//                         courseId={course.id}
//                         userId={user.id}
//                         category={course.category}
//                         onUpdate={fetchCourseAndChapter}
//                     />
//                     <LevelCard
//                         courseId={course.id}
//                         userId={user.id}
//                         level={course.level}
//                         onUpdate={fetchCourseAndChapter}
//                     />
//                     <SubjectCard
//                         courseId={course.id}
//                         userId={user.id}
//                         subject={course.subject}
//                         onUpdate={fetchCourseAndChapter}
//                     />
//                     <PriceCard
//                         courseId={course.id}
//                         price={course.price}
//                         onUpdate={fetchCourseAndChapter}
//                     />
//                 </div>
//                 <div>
//                     <ChapterList
//                         courseId={course.id}
//                         chapters={chapters}
//                         onUpdate={fetchCourseAndChapter}
//                     />
//                 </div>
//             </div>
//         </main>
//     )
// };
// export default CourseIdPage;