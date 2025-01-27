"use client"

import { activateCourse } from "@/actions/student/activate-course";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ActivateCourseButton = ({
    courseId
}:{
    courseId:string
}) => {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    async function handleActivate() {
        setIsSubmitting(true)
        try {
            await activateCourse(courseId)
            toast.success("Aktywowano kurs")
            router.refresh()
        } catch(error) {
            toast.error("Nie udało się aktywować kursu")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }
    
    return ( 
        <Button
            fullWidth
            color="primary"
            onPress={handleActivate}
            className="text-white"
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
        >
            {isSubmitting ? "Aktywacja kursu..." : "Aktywuj kurs"}
        </Button>
     );
}
 
export default ActivateCourseButton;