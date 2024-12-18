import Sidebar from "@/components/Dashboard/sidebar";
import { Separator } from "@/components/ui/separator";

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <main className="h-full">
            <div className="flex">
                {children}
            </div>
        </main>
    )
}
export default DashboardLayout;