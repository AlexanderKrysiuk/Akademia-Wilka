"use client"

import { getCourseBySlug } from "@/actions/course/course";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Course } from "@prisma/client";
import axios from "axios";
import {Input} from "@nextui-org/input";
import { ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import {Tabs, Tab} from "@nextui-org/tabs";
import { checkIfUserExistsByEmail } from "@/actions/course/payment";
import React from "react";
import { Elements } from '@stripe/react-stripe-js' 
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/stripe/checkout-form";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";



const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY!)

interface RegisterFormData {
  email: string,
  firstName: string,
  lastName: string
}

const CourseCheckoutPage = ({ params }: { params: { CourseSlug: string }}) => {
  const [course, setCourse] = useState<Course>()
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<RegisterFormData>()
  const [selected, setSelected] = useState("information");
  const router = useRouter()
  const { register, handleSubmit } = useForm<RegisterFormData>()

  const fetchCourse = async() => {
    const course = await getCourseBySlug(params.CourseSlug)
    if (!course) {
      router.push("/kursy/")
      return
    }
    setCourse(course)
  }

  useEffect(()=>{
    setLoading(true)
    fetchCourse()
    setLoading(false)
  },[])
  

  {/* 
  const handleRegisterAndPay: SubmitHandler<RegisterFormData> = async (data) => {
    const { email, name, password } = data;
    try {
      const response = await axios.post(`/api/courses/${course!.id}/checkout`, data)
      window.location.href = response.data.url
    } catch (error) {
      console.error("Payment error:", error)
    }
  }
  */}

  const proceedPaymentWithRegister = async (data: RegisterFormData) => {
    const {email} = data
    const existingUser = await checkIfUserExistsByEmail(email)
    if (existingUser) {
      // TODO: Exisitnig user
    } else {
      setUserInfo(data)
      setSelected("purchase")
    }
  }


  return loading ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="animate-spin mr-[1vw]"/>
      Ładowanie...
    </div>
  ) : (
    <div className="space-y-[1vh] w-full px-[1vw] py-[1vh] md:px-[10vw]">
      {course && (
        <div className="w-full">
          <h1 className="w-full flex justify-center">Od nowej dawki wiedzy</h1>
          <h3 className="w-full flex justify-center">Dzieli Cię juz tylko jeden krok</h3>
          <div className="grid grid-cols-2 gap-x-[1vw]">
            <div>
              <h5 className="w-full flex justify-center">
                {course.title}
              </h5>
              {course.imageUrl ? (
                <Image
                  fill
                  className="object-cover aspect-video"
                  alt={course.title}
                  src={course.imageUrl}
                />
              ):(
                <div className="bg-primary/10 flex w-full items-center justify-center aspect-video">
                  <ImageIcon className="h-[5vh] w-[5vh]"/>
                </div>
              )}
              <div className="px-[1vw] py-[1vh]">
                Cena: {formatPrice(course.price!)}
              </div>
            </div>
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
                
                {/* 
                <Tabs
                  fullWidth
                  disabledKeys={["purchase"]}
                  selectedKey={selected}
                  onSelectionChange={(key) => setSelected(String(key))} // Zamieniamy 'key' na string
                  >
                  <Tab key="information" title="Informacje">
                    <form className="space-y-[1vh]" onSubmit={handleSubmit(proceedPaymentWithRegister)}>
                      <Input {...register("email")} isRequired label="E-mail" placeholder="jan.kowalski@przykład.pl" type="email"/>
                      <Input {...register("firstName")} isRequired label="Imię" placeholder="Jan"/>
                      <Input {...register("lastName")} isRequired label="Nazwisko" placeholder="Kowalski"/>
                      <Button fullWidth color="primary" type="submit">
                        Przejdź do płatności
                      </Button>
                    </form>
                  </Tab>
                  <Tab key="purchase" title="Płatność">
                      <Elements
                        stripe={stripePromise}
                        options={{
                          mode: "payment",
                          currency: "pln",
                          amount: Math.round(course.price! * 100)
                        }}
                      >
                        <CheckoutForm amount={course.price!}/>
                      </Elements>
                  </Tab>
                </Tabs>
              */}

              </CardBody>
              {userInfo && (
                (JSON.stringify(userInfo, null, 2))
              )}
            </Card>
          </div>  
        </div>
      )}
    </div>
  )
}
 
export default CourseCheckoutPage;


{/* 
"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Course } from "@prisma/client";
import { getCourseBySlug } from "@/actions/course/course";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { useCurrentUser } from "@/hooks/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";

const CourseCheckoutPage = ({ params }: { params: { CourseSlug: string } }) => {
    const [course, setCourse] = useState<Course>();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const user = useCurrentUser();
    
    const fetchCourse = async () => {
      const course = await getCourseBySlug(params.CourseSlug);
      if (!course) {
        router.push("/kursy");
            return;
        }
        setCourse(course);
      };
      
      useEffect(() => {
        setLoading(true);
        fetchCourse();
        setLoading(false);
      }, []);
      
      const handleCheckout = (email: string) => {
        router.push(`/courses/${course!.id}/checkout?email=${encodeURIComponent(email)}`);
      };
      

      return loading ? (
        <div className="w-full flex justify-center">
            <Loader2 className="animate-spin mr-[1vw]" />
            Ładowanie...
        </div>
    ) : (
        <div className="space-y-[1vh] w-full px-[1vw] py-[1vh] md:px-[20vw]">
            {course && (
                <div className="w-full">
                    <h1>Kupujesz kurs</h1>
                    <Card>
                        <div className="grid grid-cols-3">
                            <div className="col-span-1">
                                <div className="aspect-video">
                                    {course.imageUrl ? (
                                        <Image
                                            fill
                                            className="object-cover rounded-l"
                                            alt={course.title}
                                            src={course.imageUrl}
                                        />
                                      ) : (
                                        <div className="bg-primary/10 flex w-full h-full items-center justify-center rounded-l">
                                            <ImageIcon className="h-[5vh] w-[5vh]" />
                                            </div>
                                    )}
                                    </div>
                            </div>
                            <div className="col-span-2 border-r border-red-500">
                                <CardHeader>
                                    <CardTitle>{course.title}</CardTitle>
                                    Cena: {formatPrice(course.price!)}
                                </CardHeader>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
            {user ? (
                <div>
                </div>
            ) : (
                <Tabs defaultValue="Logowanie" className="w-full">
                    <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="Logowanie">Logowanie</TabsTrigger>
                        <TabsTrigger value="Rejestracja">Rejestracja</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Logowanie">
                        <div className="w-full flex justify-center">
                            <Card className="max-w-[600px] pt-[1vh]">
                                <CardHeader />
                                <CardContent>
                                    <LoginForm
                                      onLogin={handleCheckout}
                                      />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="Rejestracja">
                        <div className="w-full flex justify-center">
                            <Card className="max-w-[600px] pt-[1vh]">
                                <CardContent>
                                    <RegisterForm onRegistered={handleCheckout} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
};

export default CourseCheckoutPage;
*/}
