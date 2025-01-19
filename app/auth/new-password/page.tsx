import NewPasswordForm from "@/components/auth/new-password-form";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import Link from "next/link";

const NewPasswordPage = () => {
    return ( 
        <div className="w-full flex justify-center">
            <Card className="w-full max-w-xs my-[10vh] mx-[2vw]">
                <CardHeader className="w-full flex justify-center">
                    <h4>
                        🔐 Nowe Hasło
                    </h4>
                </CardHeader>
                <CardBody>
                    <NewPasswordForm/>
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
 
export default NewPasswordPage;