"use client"
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Card, CardBody } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";

const StartPage = () => {
    return ( 
        <div className="w-full flex justify-center">
            <Card className="w-full max-w-xs my-[10vh] mx-[2vw]">
                <CardBody>
                    <Tabs fullWidth>
                        <Tab key="login" title="Logowanie">
                            <LoginForm
                                redirectUrl="/kokpit"
                            />
                        </Tab>
                        <Tab key="register" title="Rejestracja">
                            <RegisterForm/>
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </div>
    );
}
 
export default StartPage;