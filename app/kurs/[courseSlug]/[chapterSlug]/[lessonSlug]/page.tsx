"use client"

import { Button } from "@nextui-org/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const LessonPage = () => {
    const [menuVisible, setMenuVisible] = useState(false)
    
    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)");
        const handleResize = () => setMenuVisible(mediaQuery.matches);
        handleResize(); // Sprawdź początkowy stan
        mediaQuery.addEventListener("change", handleResize);
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);
    
    return (
        <main className="w-full h-full flex flex-row">
            LessonPage
        </main>
    );
}
 
export default LessonPage;