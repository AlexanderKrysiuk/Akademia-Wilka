"use client"
import { Spinner } from "@heroui/react";
import { ImageOff } from "lucide-react";

export const ImageNotFound = () => {
    return ( 
        <div className="w-full h-auto aspect-video bg-primary/10 items-center flex justify-center flex-col">
            <ImageOff
                className="w-12 h-12"
            />
            <span
                className="text-xl"
            >
                Brak Obrazka
            </span>
        </div>
     );
}

export const PageLoader = () => {
    return (
        <Spinner 
            color="primary" 
            label="Ładowanie" 
            labelColor="primary"
            className="w-full h-full flex items-center justify-center"
        />
    )
}