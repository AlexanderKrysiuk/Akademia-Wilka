import ResetForm from "@/components/auth/reset-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const ResetPage = () => {
    return (
        <div className="py-[10vh] px-[10vw] flex justify-center">

        <Card className="py-[1vh] px-[1vw] max-w-[600px] space-y-[1vh]">
            <CardHeader>
                <CardTitle className="justify-center flex">
                    Nie pamiętasz hasła?
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResetForm/>
            </CardContent>
            <CardFooter className="flex justify-center">
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
 
export default ResetPage;