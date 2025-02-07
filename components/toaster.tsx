"use client"

import { ToastContainer, Slide } from 'react-toastify';
import { useTheme } from "next-themes";

const Toaster = () => {
    const { theme } = useTheme()
    return (
        <ToastContainer
            position="top-center"
            transition={Slide}
            theme={theme}
          />
    );
}
 
export default Toaster;