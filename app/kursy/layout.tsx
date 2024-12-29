import React, { Children } from "react";

const CoursesLayout = ({
    children
} : {
    children: React.ReactNode
}) => {
    return ( 
        <main className="flex justify-center p-4">
            <div className="max-w-7xl px-[10vw]">
                {children}
            </div>
        </main>
     );
}
 
export default CoursesLayout;