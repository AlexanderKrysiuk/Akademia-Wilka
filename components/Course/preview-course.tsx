"use client"

import { getPreviewLesson } from "@/actions/course/lesson";
import { Course } from "@prisma/client";
import { Eye, Icon, Loader2, Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";

interface PreviewCourseButtonProps {
    course: Course
}

const PreviewCourseButton = ({
    course
}: PreviewCourseButtonProps) => {
    const [previewURL, setPreviewURL] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    const fetchPreviewURL = async () => {
        setLoading(true)
        try {
            const url = await getPreviewLesson(course.id)
            setPreviewURL(url);
        } catch (error) {
            toast.error(`${error}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        if (previewURL) {
            router.push(`/kurs/${previewURL}`)
        }
    }, [previewURL, router])

    
    return ( 
        <Button
            variant={`outline`}
            disabled={loading}
            onClick={fetchPreviewURL}
            size={`icon`}
        >
            {loading ? (
                <Loader2 className="animate-spin"/>
            ):(
                <Eye/>
            )}
        </Button>
     );
}
 
export default PreviewCourseButton;