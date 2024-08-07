import NewPasswordForm from "@/components/auth/new-password-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const NewPasswordPage = () => {
    return ( 
        <div className="py-[10vh] px-[10vw] flex justify-center">
            <Card className="py-[1vh] px-[1vw] max-w-[600px] space-y-[1vh]">
                <CardHeader>
                    <CardTitle className="justify-center flex">
                        🔐Nowe Hasło
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <NewPasswordForm/>
                </CardContent>
                <CardFooter>
                    <Link href="/auth/login" passHref>
                        <Button variant={`link`}>
                            Powrót do logowania
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
     );
}
 
export default NewPasswordPage;