import SideBar from "@/components/dashboard/sidebar";

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <main>
            <div className="flex flex-row">
                <div className="hidden md:block w-[20vw] max-w-full">
                    <SideBar/>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </main>
    )
}
export default DashboardLayout;