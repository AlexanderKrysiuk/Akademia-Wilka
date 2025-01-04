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
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: menuVisible ? "auto" : "0%" }}
                transition={{ duration: 0.3 }}
                className="shadow-lg overflow-hidden h-full"
            >
                Lesson Menu
            </motion.div>
            <div className="w-full">
                <div className="bg-primary text-white w-full flex flex-row">
                    <Button
                        isIconOnly
                        color="primary"
                        onClick={()=>{setMenuVisible(!menuVisible)}}
                    >
                        <motion.div
                            animate={{ rotate: menuVisible ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronRight/>
                        </motion.div>
                    </Button>
                    <div className="w-full flex justify-center items-center">
                        Lesson Navbar
                    </div>
                </div>
                LessonPage
            </div>
        </main>
     );
}
 
export default LessonPage;