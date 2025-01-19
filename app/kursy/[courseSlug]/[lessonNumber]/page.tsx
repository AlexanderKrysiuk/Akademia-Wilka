import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Divider } from "@heroui/react"
import LessonWrapper from "./LessonWrapper"

const LessonPage = async ({
    params
} : {
    params: {
        courseSlug: string
        lessonNumber: string
    }
}) => {

    const session = await auth()
    const user = session?.user
    if (!user || !user.id) redirect(`/auth/start`)

    const course = await prisma.course.findUnique({
        where: { slug: params.courseSlug }
    })
    if (!course) redirect("/kursy/")
    const userProgress = await prisma.user.findFirst({
        where: { id: user.id },
        select: {
            courses: { where: { id: course.id }},
            completedLessons: {
                where: {
                    courseId: course.id,
                    published: true
                },
                select: {
                    id: true
                }
            }
        }
    })

    if (!userProgress?.courses.length) redirect(`/kursy/${course.slug}`)
    const completedLessonsIds = userProgress.completedLessons.map(lesson => lesson.id)
    const lessons = await prisma.lesson.findMany({
        where: {
            courseId: course.id, 
            published: true
        },
        orderBy: {
            order: "asc"
        }
    })

    const lessonNumber = parseInt(params.lessonNumber.replace('lekcja-', ''), 10);
    // Sprawdzamy, czy lekcja o numerze `lessonNumber` istnieje
    const currentlesson = lessons.find(lesson => lesson.order === lessonNumber);

    if (!currentlesson) {
        // Jeśli lekcja nie istnieje, przekierowujemy na pierwszą dostępną
        redirect(`/kursy/${course.slug}/lekcja-${lessons[0]?.order}`);
    }

    // COMPLETED LESSONS
    // {JSON.stringify(completedLessonsIds)}
    // <Divider/>
    // LESSONS
    // {JSON.stringify(lessons)}
    // <Divider/>
    return ( 
        <LessonWrapper
            course={course}
            lessons={lessons}
            initialCompletedLessonsIds={completedLessonsIds}
            lessonNumber={lessonNumber}
            currentLesson={currentlesson}
        />
    );
}
 
export default LessonPage;




// "use client"

// import { LessonPageAccessStatus, getPublishedCourseBySlug } from "@/actions/student/course"
// import { LessonDispal } from "@/components/course-display/lesson-display"
// import LessonMenu from "@/components/course-display/lesson-menu"
// import { PageLoader } from "@/utils/Page-Placeholders"
// import { Button, Divider, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from "@heroui/react"
// import { Course, Lesson } from "@prisma/client"
// import { ChevronRight } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { useEffect, useState } from "react"

// const LessonPage = ({       
//     params
// } : {
//     params: {
//         courseSlug:string
//         lessonNumber:number
//     }
// }) => {
//     const router = useRouter()
//     const {isOpen, onOpen, onOpenChange} = useDisclosure()
//     const [loading, setLoading] = useState(true)
//     const [course, setCourse] = useState<Course>()
//     const [lessons, setLessons] = useState<Lesson[]>([])
//     const [completedLessonsIds, setCompletedLessonsIds] = useState<string[]>([])

//     useEffect(()=>{
//         async function fetchData () {
//             try {
//                 const course = await getPublishedCourseBySlug(params.courseSlug)
//                 if (!course) return router.push("/kursy")
//                 const result = await LessonPageAccessStatus(course.id)
//                 if (!result || !result.allLessons || !result.completedLessonsIds) return router.push('/kursy')
//                 setCourse(course)
//                 setLessons(result.allLessons)
//                 setCompletedLessonsIds(result.completedLessonsIds)
//             } catch(error) {
//                 console.error("Błąd podczas ładowania lekcji")
//             } finally {
//                 setLoading(false)
//             }
//         }
//         fetchData()
//     },[params.courseSlug, router])

//     if (loading) return <PageLoader/>

//     if (!course) return router.push("/kursy")    

//     return (
//         <main className="w-full">
//             <Drawer
//                 isOpen={isOpen}
//                 placement="left"
//                 onOpenChange={onOpenChange}
//             >
//                 <DrawerContent>
//                     {(onClose)=>(
//                         <>
//                             <DrawerHeader/>
//                             <DrawerBody
//                                 className="px-0"
//                             >
//                                 <LessonMenu
//                                     course={course}
//                                     lessons={lessons}
//                                     completedLessonsIds={completedLessonsIds}
//                                 />
//                             </DrawerBody>
//                             <DrawerFooter>
//                                 <Button
//                                     color="danger"
//                                     variant="light"
//                                     onPress={onClose}
//                                 >
//                                     Zamknij
//                                 </Button>
//                             </DrawerFooter>
//                         </>
//                     )}
//                 </DrawerContent>
//             </Drawer>
//             <div className="w-full h-full flex flex-row">
//                 <div className="w-1/4 overflow-y-auto shadow-md dark:shadow-white hidden lg:block h-full">
//                     <LessonMenu
//                         course={course}
//                         lessons={lessons}
//                         completedLessonsIds={completedLessonsIds}
//                     />
//                 </div>
//                 <div className="w-full flex flex-col">
//                     <div className="bg-primary text-white w-full flex items-center">
//                         <Button
//                             isIconOnly
//                             color="primary"
//                             onPress={onOpen}
//                             className="lg:hidden"
//                         >
//                             <ChevronRight/>
//                         </Button>
//                     </div>
//                     <div>
//                         <LessonDispal
//                             lessonNumber={params.lessonNumber}
//                             lessons={lessons}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// }
 
// export default LessonPage;