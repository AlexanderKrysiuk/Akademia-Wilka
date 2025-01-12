import React, { Children } from "react";

const CoursesLayout = ({
    children
} : {
    children: React.ReactNode
}) => {
    return ( 
        <main className="flex justify-center h-full w-full">
        {children}
        </main>
     );
}
 
export default CoursesLayout;