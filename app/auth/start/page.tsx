"use client"

import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";

const StartPage = () => {
  return (
    <main
        className="absolute inset-0 flex items-center justify-center"
    >

    <Card    
        className="m-4 w-full max-w-xs"
    >
        <CardBody>
            <Tabs
                fullWidth
            >
                <Tab title="Logowanie">
                    <LoginForm/>
                </Tab>
                <Tab title="Rejestracja">
                    <RegisterForm/>
                </Tab>
            </Tabs>
        </CardBody>
    </Card>
    </main>
  )
}

export default StartPage;