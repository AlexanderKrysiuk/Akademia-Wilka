import { CircleCheckBig, TriangleAlert } from 'lucide-react';

type Result = {
    success: boolean;
    message: string;
} | null;

const RenderResultMessage = (result: Result) => {
    if (!result) return null;

    return (
        <div className={`flex mx-auto justify-center ${result.success ? 'text-emerald-500' : 'text-red-500'}`}>
            <p className="flex items-center gap-x-[1vw]">
                {result.success ? <CircleCheckBig /> : <TriangleAlert />}
                {result.message}
            </p>
        </div>
    );
};

export default RenderResultMessage;