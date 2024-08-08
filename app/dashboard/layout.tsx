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
                <div className="">
                    {children}
                </div>
            </div>
            <div>
            </div>
        </main>
    )
}
export default DashboardLayout;