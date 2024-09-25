"use client"
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Card, CardBody } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";

const StartPage = () => {
    return ( 
        <div className="w-full my-[10vh] flex items-center justify-center">
            <div className="flex flex-col max-w-[600px] mx-[1vw]">
                <Card>
                    <CardBody>
                        <Tabs fullWidth>
                            <Tab key="login" title="Logowanie">
                                <LoginForm/>
                            </Tab>
                            <Tab key="register" title="Rejestracja">
                                <RegisterForm/>
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
 
export default StartPage;