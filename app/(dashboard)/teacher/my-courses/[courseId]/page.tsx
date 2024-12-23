"use client"
import { useCurrentUser } from "@/hooks/user";
import { Course, Chapter, Category, UserRole, Level } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { Settings } from 'lucide-react';
import { GetMyCreatedCourse, unpublishCourse } from "@/actions/course-teacher/course";
import PageLoader from "@/components/page-loader";
import { Button, Card, CardBody, CardFooter, CardHeader, Progress } from "@nextui-org/react";
import TitleCard from "@/components/Course-Create/Course/title-card";
import SlugCard from "@/components/Course-Create/Course/slug-card";
import ImageCard from "@/components/Course-Create/Course/image-card";
import { toast } from "react-toastify";
import PublishButton from "@/components/Course-Create/Course/publish-button";
import CategoryCard from "@/components/Course-Create/Course/category-card";
import { GetCategories } from "@/actions/course-teacher/category";
import { GetLevels } from "@/actions/course-teacher/level";
import LevelCard from "@/components/Course-Create/Course/level-card";
import PriceCard from "@/components/Course-Create/Course/price-card";
import { GetChaptersByCourseId } from "@/actions/chapter-teacher/chapter";
import ChapterList from "@/components/Course-Create/Chapter/chapter-list";


const CourseIdPage = ({
    params
} : {
    params: { courseId: string }
}) => {
    const user = useCurrentUser();        
    const [course, setCourse] = useState<Course | null>(null);
    const [categories, setCategores] = useState<Category[]>([]);
    const [levels, setLevels] = useState<Level[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    
    const requiredFields = useMemo(() => (
        course ? [
            course.title,
            course.slug,
            course.imageUrl,
            course.categoryId,
            course.levelId,
            chapters.some(chapter => chapter.published)
        ] : []
    ), [course, chapters]);
    const completedFields = requiredFields.filter(Boolean).length;

    const fetchCourseData = useCallback(async () => {
        if(!user) return

        setLoading(true)
        try {
            const [fetchedCourse, fetchedChapters, fetchedCategories, fetchedLevels] = await Promise.all([
                GetMyCreatedCourse(user.id, params.courseId),
                GetChaptersByCourseId(params.courseId),
                GetCategories(),
                GetLevels()
            ])
            if (fetchedCourse.ownerId !== user.id && !user.role.includes(UserRole.Admin)) {
                return
            }
            if (completedFields < requiredFields.length && fetchedCourse.published) {
                await unpublishCourse(fetchedCourse.id)
                toast.warning(
                    "Kurs zmienił status na: szkic. Uzupełnij wszystkie pola, by go opublikować."
                );
            }
                setCourse(fetchedCourse)
                setChapters(fetchedChapters)
                setCategores(fetchedCategories)
                setLevels(fetchedLevels)
        } catch(error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false)
        }
    }, [user, params.courseId, completedFields, requiredFields])

    useEffect(()=>{
        fetchCourseData()
    }, [user, params.courseId])

    {/*
    const fetchMyCreatedCourse = useCallback(async () => {
        if (!user) return;
        const fetchedCourse = await GetMyCreatedCourse(user.id, params.courseId);
        
        if (fetchedCourse.ownerId !== user.id && !user.role.includes(UserRole.Admin)) return;

        if (completedFields < requiredFields.length && fetchedCourse.published) {
            await unpublishCourse(fetchedCourse.id);
            toast.warning("Kurs zmienił status na:szkic, uzupełnij wszystkie pola by go opublikować");
        }            
        setCourse(fetchedCourse);
    }, [user, params.courseId, completedFields, requiredFields]);
    */}

    {/*
    const fetchCategories = useCallback(async () => {
        const fetchedCategories = await GetCategories();
        setCategores(fetchedCategories);
    }, []);
    */}

    {/*
    const fetchLevels = useCallback(async () => {
        const fetchedLevels = await GetLevels();
        setLevels(fetchedLevels);
    }, []);
    */}

{/*
    const fetchChapters = useCallback(async () => {
        const fetchedChapters = await GetChaptersByCourseId(params.courseId);
        setChapters(fetchedChapters);
    }, [params.courseId]);
*/}

{/*
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchMyCreatedCourse(), fetchCategories(), fetchLevels(), fetchChapters()]);
            setLoading(false);
        };

        loadData();
    }, [user, params, fetchMyCreatedCourse, fetchCategories, fetchLevels, fetchChapters]);
*/}

    if (loading) {
        return <PageLoader/>
    }

    if (!course) {
        return <div> Brak danych o kursie </div>
    }

    return (
        <main className="w-full">
            <Card className="mb-4">
                <CardHeader className="w-full justify-between">
                    <div className="flex">
                        <Settings/>
                        {course.title}
                    </div>
                    <div>
                        <PublishButton
                            courseId={course.id}
                            published={course.published}
                            onUpdate={fetchCourseData}
                            completedFields={completedFields}
                            requiredFields={requiredFields.length}
                        />
                    </div>
                </CardHeader>
                <CardBody>
                    <Progress
                        label={`(${completedFields}/${requiredFields.length})`}
                        value={completedFields / requiredFields.length * 100}
                        showValueLabel={true}
                        color={completedFields / requiredFields.length === 1 ? "success" : "warning"} 
                    />
                </CardBody>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <TitleCard
                        courseId={course.id}
                        title={course.title}
                        onUpdate={fetchCourseData}
                    />
                    <SlugCard
                        courseId={course.id}
                        slug={course.slug}
                        onUpdate={fetchCourseData}
                    />
                    <ImageCard
                        courseId={course.id}
                        imageUrl={course.imageUrl}
                        onUpdate={fetchCourseData}
                    />
                    <CategoryCard
                        courseId={course.id}
                        categoryId={course.categoryId}
                        categories={categories}
                        onUpdate={fetchCourseData}
                    />
                    <LevelCard
                        courseId={course.id}
                        levelId={course.levelId}
                        levels={levels}
                        onUpdate={fetchCourseData}
                    />
                    <PriceCard
                        courseId={course.id}
                        price={course.price}
                        onUpdate={fetchCourseData}
                    />
                </div>
                <div>
                    <ChapterList
                        courseId={course.id}
                        chapters={chapters}
                        onUpdate={fetchCourseData}
                    />
                </div>
            </div>
        </main>
    )
    
    {/*
    return (
        course ? 
            <main className="mb-12">
                <Card className="mb-[4vh]">
                    <CardHeader className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <Settings />
                            <h6>{course.title}</h6>
                        </div>
                        <div>
                            <PublishButton
                                courseId={course.id}
                                published={course.published}
                                onUpdate={fetchMyCreatedCourse}
                                completedFields={completedFields}
                                requiredFields={requiredFields.length} 
                            />
                        </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-[1vh]">
                        <TitleCard
                            courseId={course.id}
                            title={course.title}
                            onUpdate={fetchMyCreatedCourse}
                        />
                        <SlugCard
                            courseId={course.id}
                            slug={course.slug}
                            onUpdate={fetchMyCreatedCourse}
                        />
                        <ImageCard
                            courseId={course.id}
                            imageUrl={course.imageUrl}
                            onUpdate={fetchMyCreatedCourse}
                        />
                        <CategoryCard
                            courseId={course.id}
                            categoryId={course.categoryId}
                            categories={categories}
                            onUpdate={fetchMyCreatedCourse}
                        />
                        <LevelCard
                            courseId={course.id}
                            levelId={course.levelId}
                            levels={levels}
                            onUpdate={fetchMyCreatedCourse}
                        />
                        <PriceCard
                            courseId={course.id}
                            price={course.price}
                            onUpdate={fetchMyCreatedCourse}
                        />
                    </div>
                    <div className="space-y-[1vh]">
                        <ChapterList
                            courseId={course.id}
                            chapters={chapters}
                            onUpdate={fetchChapters}
                        />
                    </div>
                </div>
            </main>
        : 
            <div>
            </div>
            //{JSON.stringify(course,null,2)}
    )
*/}

    {/* 
    const user = useCurrentUser();
    const router = useRouter();
    const [course, setCourse] = useState<Course>();



    const fetchCourse = async () => {
        const course = await getCourseById(params.courseId);
        if (!course) {
            router.push("/");
            return;
        }
        setCourse(course);
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
        course.categoryId,
        course.levelId
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    return (
        <div className="w-full px-[1vw] py-[1vh] space-y-[1vh] mb-[10vh]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
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
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[1vw] gap-y-[1vh]">
                <div className="space-y-[1vh]">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                        <TitleForm
                            course={course}
                            userID={user.id}
                            onUpdate={() => {
                                fetchCourse();
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                        <CourseSlugForm
                            course={course}
                            userID={user.id}
                            onUpdate={()=>{
                                fetchCourse();
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                       <DescriptionForm
                            course={course}
                            userID={user.id}
                            onUpdate={() => {
                                fetchCourse();
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                        <ImageForm
                            course={course}
                            userID={user.id}
                            onUpdate={()=>{
                                fetchCourse()
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>            
                        <CategoryForm
                            course={course}
                            userID={user.id}
                            onUpdate={() => {
                                fetchCourse()
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>   
                       <LevelForm
                            course={course}
                            userID={user.id}
                            onUpdate={() => {
                                fetchCourse()
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>    
                        <PriceForm
                            course={course}
                            userID={user.id}
                            onUpdate={() => {
                                fetchCourse()
                            }}
                        />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                        <AttachmentForm
                            course={course}
                            userID={user.id} 
                        />
                    </motion.div>
                </div>
                <div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                        <ChapterForm
                            course={course}
                            userID={user.id}
                        />
                    </motion.div>
                </div>           
            </div>
        </div>
    );
    */}

};
export default CourseIdPage;