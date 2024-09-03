"use client"

import { getPublishedChaptersByCourseID } from "@/actions/course/chapter"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Chapter } from "@prisma/client"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface ChapterListProps {
    course: {
        id:string
    }
}

const ChapterList = ({
    course
}:ChapterListProps) => {
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [expandedChapters, setExpandedChapters] = useState<string[]>([])
    
    const fetchChapters = async () => {
        setLoading(true)
        const chapters = await getPublishedChaptersByCourseID(course.id) 
        setChapters(chapters)
        setLoading(false)
    }

    useEffect(()=> {
        fetchChapters();
    },[])

    const toggleExpandChapter = (chapterID:string) => {
        setExpandedChapters(prev => 
            prev.includes(chapterID) ? prev.filter(id => id !== chapterID) : [...prev, chapterID]
        )
    }
    
    return ( 
        <Card>
            <CardHeader>
                <CardTitle>
                    Zawartość Kursu
                </CardTitle>
            </CardHeader>
            <Separator/>
            {loading ? (
                <CardContent className="flex items-center justify-center py-[2vh]">
                    <Loader2 className="animate-spin mr-2" />
                    Ładowanie...
                </CardContent>
            ):(
                chapters.length > 0 ? (
                    <CardContent className="my-[2vh]">
                    {chapters.map((chapter) => (
                        <Card className="my-[2vh] py-0">
                            <div className={`px-[2vw] flex justify-between items-center transition-colors duration-300 ${
                            expandedChapters.includes(chapter.id) 
                            ? "bg-foreground/10 text-primary" 
                            : "bg-foreground/5" 
                            }`}>
                                <h6 className="hover:text-primary transition-all duration-300">
                                    {chapter.title}
                                </h6>
                                <ChevronDown
                                    onClick={() => toggleExpandChapter(chapter.id)}
                                    className={`cursor-pointer text-primary transition-transform duration-500 transform ${
                                        expandedChapters.includes(chapter.id) ? "rotate-180" : "rotate-0"
                                    }`}
                                />
                            </div>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: expandedChapters.includes(chapter.id) ? 'auto' : 0, opacity: expandedChapters.includes(chapter.id) ? 1 : 0 }}
                                transition={{ duration: 0.5 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div className="bg-background px-[2vw] border-0 rounded-b-lg flex items-center">
                                    123
                                </div>
                            </motion.div>
                                {/* 
                                {expandedChapters.includes(chapter.id) ? 
                                    <ChevronUp
                                        onClick={() => toggleExpandChapter(chapter.id)}
                                        className="cursor-pointer text-primary"
                                    />
                                    :
                                    <ChevronDown
                                        onClick={() => toggleExpandChapter(chapter.id)}
                                        className="cursor-pointer text-primary"
                                    />
                                }
                                */}
                        </Card>
                    ))}
                    </CardContent>
                ):(
                    <CardContent className="flex items-center justify-center py-[2vh]">
                    Brak rozdziałów do wyświetlenia... 
                    </CardContent>
                )
            )}
            {JSON.stringify(chapters,null,2)}
        </Card>
     );
}
 
export default ChapterList;