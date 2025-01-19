import ResetForm from "@/components/auth/reset-form";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import Link from "next/link";

const ResetPage = () => {
    return (
        <div className="w-full flex justify-center">
            <Card className="w-full max-w-xs my-[10vh] mx-[2vw]">
                <CardHeader className="w-full flex justify-center">
                    <h4>
                        Nie pamiętasz hasła?
                    </h4>
                </CardHeader>
                <CardBody>
                    <ResetForm/>
                </CardBody>
                <CardFooter className="flex justify-center">
                    <Link href="/auth/start" passHref className="text-sm text-primary transition-all duration-300 hover:underline">
                        Powrót do logowania
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
 
export default ResetPage;