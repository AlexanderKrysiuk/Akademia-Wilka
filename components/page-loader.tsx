"use client"

import { Loader2 } from "lucide-react";

const PageLoader = () => {
    return ( 
        <div className='w-full h-full flex items-center justify-center gap-2'>
            <Loader2 className="animate-spin"/>
            Ładowanie...
        </div>
     );
}
 
export default PageLoader;