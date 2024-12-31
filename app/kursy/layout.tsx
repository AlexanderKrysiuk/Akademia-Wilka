import React, { Children } from "react";

const CoursesLayout = ({
    children
} : {
    children: React.ReactNode
}) => {
    return ( 
        <main className="flex justify-center mx-auto w-full max-w-7xl lg:px-[10vw]">
            {children}
        </main>
     );
}
 
export default CoursesLayout;