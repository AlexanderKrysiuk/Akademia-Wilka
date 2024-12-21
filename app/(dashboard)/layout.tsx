"use client"
import SideBar from "@/components/Dashboard/sidebar";
import Sidebar from "@/components/Dashboard/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false)


    return (
        <main className="flex p-4">
            {/*
            <motion.div
                animate={{
                    width: isSidebarOpen ? "auto" : "0", 
                }}
                transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                }}
                className={`overflow-hidden`}
                >
                <div className="h-10 bg-primary/50">

                </div>
                <SideBar/>
                
            </motion.div>
            <div className="w-full max-h-full">

                <div className="h-10 bg-primary/50 items-center flex">
                    <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        className="m-1 bg-background"
                        variant="ghost"
                        color="primary"
                        onClick={()=>{setSidebarOpen(!isSidebarOpen)}}
                    >
                        <ArrowRight
                            className={`transition-transform duration-300 ${isSidebarOpen ? "rotate-180" : "rotate-0"} primary`}
                        />
                    </Button>
                </div>

                <div className="flex">
                    {children}
                </div>
            </div>
                */}
            {children}
        </main>
    )
}
export default DashboardLayout;