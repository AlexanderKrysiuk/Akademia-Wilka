"use client"

import RegisterForm from "@/components/auth/register-form";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";

const StartPage = () => {
  return (
    <main
        className="absolute inset-0 flex items-center justify-center"
    >

    <Card    
        className="m-4"
    >
        <CardBody>
            <Tabs
                fullWidth
            >
                <Tab title="Logowanie">

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