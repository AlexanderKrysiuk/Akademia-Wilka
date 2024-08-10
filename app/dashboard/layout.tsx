import SideBar from "@/components/dashboard/sidebar";

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <main>
            <div className="flex flex-row">
                <div className="hidden md:block">
                    <SideBar/>
                </div>
                <div className="w-full">
                    {children}
                </div>
            </div>
        </main>
    )
}
export default DashboardLayout;