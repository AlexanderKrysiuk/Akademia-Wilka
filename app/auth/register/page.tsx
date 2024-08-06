import RegisterForm from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const RegisterPage = () => {
    return ( 
        <div className="py-[10vh] px-[10vw] flex justify-center">
            <Card className="py-[1vh] px-[1vw] max-w-[600px] space-y-[1vh]">
                <CardHeader>
                    <CardTitle className="justify-center flex">
                        🔐Rejestracja
                    </CardTitle>
                    <CardContent>
                        <RegisterForm/>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link href="/auth/login" passHref>
                            <Button variant={`link`}>
                            Masz już konto?
                            </Button>
                        </Link>
                    </CardFooter>
                </CardHeader>
            </Card>
        </div>
    );
}
 
export default RegisterPage;