"use client"

import React, { Children } from "react";

const LessonLayout = ({
    children
} : {
    children: React.ReactNode
}) => {
    return ( 
        <main>
            {children}
        </main>
     );
}
 
export default LessonLayout;