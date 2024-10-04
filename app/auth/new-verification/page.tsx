import NewVerificationForm from "@/components/auth/new-verification-form";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Link from "next/link";

const NewVerificationPage = () => {
    return (
        <div className="flex flex-grow justify-center items-center">
                <Card className="max-w-xs w-full my-[2vh] mx-[1vw]">
                    <CardHeader className="w-full flex justify-center items-center">
                        <h5>
                            🔐 Weryfikacja
                        </h5>
                    </CardHeader>
                    <CardBody>
                        <NewVerificationForm/>
                    </CardBody>
                </Card>
        </div>
    );
}
 
export default NewVerificationPage;
