import NewVerificationForm from "@/components/auth/new-verification-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const NewVerificationPage = () => {
    return (
        <div className="py-[10vh] px-[10vw] flex justify-center">
            <Card className="py-[1vh] px-[1vw] max-w-[600px] space-y-[1vh]">
                <CardHeader>
                    <CardTitle className="justify-center flex">
                        🔐Weryfikacja
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <NewVerificationForm/>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/auth/login" passHref>
                        <Button variant={`link`}>
                            Przejdź do Logowania
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
 
export default NewVerificationPage;
