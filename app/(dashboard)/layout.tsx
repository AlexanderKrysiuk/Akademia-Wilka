import DashboardMenu from "@/components/dashboard/menu";
import SideBar from "@/components/dashboard/sidebar";
import { Separator } from "@/components/ui/separator";

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <main>
            <div className="flex h-full">
                <div className="hidden md:block md:w-1/5 border-r">
                    
                    <DashboardMenu/>
                    
                    {/* 
                    <Separator/>
                    <SideBar/> 
                    */}
                </div>
                <div className="w-full md:w-4/5 px-[4vw] py-[4vh]">
                    {children}
                </div>
            </div>
        </main>
    )
}
export default DashboardLayout;