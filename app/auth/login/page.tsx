import LoginForm from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const LoginPage = () => {
    return ( 
        <div className="py-[10vh] px-[10vw] flex justify-center">
            <Card className="py-[1vh] px-[1vw] max-w-[600px] space-y-[1vh]">
                <CardHeader>
                    <CardTitle className="justify-center flex">
                        🔐Rejestracja
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <LoginForm/>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/auth/register" passHref>
                        <Button variant={`link`}>
                            Nie masz konta?
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
 
export default LoginPage;