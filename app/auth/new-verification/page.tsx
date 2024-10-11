import NewVerificationForm from "@/components/auth/new-verification-form";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

const NewVerificationPage = () => {
    return (
        <div className="flex justify-center items-center">
                <Card className="max-w-xs w-full my-[10vh] mx-[2vw]">
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
