import SideBar from "@/components/dashboard/sidebar";

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <main>
            <div className="flex flex-flow-col h-full">
                <div className="hidden md:block border-r w-[20%]">
                    <SideBar/>
                </div>
                <div className="w-[80%]">
                    {children}
                </div>
            </div>
        </main>
    )
}
export default DashboardLayout;