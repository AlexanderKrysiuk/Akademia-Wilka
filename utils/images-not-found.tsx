import { ImageOff } from "lucide-react";

const ImageNotFound = () => {
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
 
export default ImageNotFound;