import SidebarRoutes from "./sidebar-routes";

const SideBar = () => {
    return ( 
            <div className="h-full md:h-[90vh] border-r shadow-sm">
                <SidebarRoutes/> 
            </div>
     );
}
 
export default SideBar;