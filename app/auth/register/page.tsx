import RegisterForm from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import Link from "next/link";

const RegisterPage = () => {
    return ( 
        <div className="py-[10vh] px-[10vw] flex justify-center">
            <Card className="py-[1vh] px-[1vw] max-w-[600px] space-y-[1vh]">
                <CardHeader>
                        🔐Rejestracja
                </CardHeader>
                <CardBody>
                    <RegisterForm/>
                </CardBody>
                <CardFooter className="flex justify-center">
                    <Link href="/auth/login" passHref>
                        <Button variant={`link`}>
                            Masz już konto?
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
 
export default RegisterPage;