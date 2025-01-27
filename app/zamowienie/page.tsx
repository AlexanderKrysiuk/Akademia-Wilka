"use client"

import { useCart } from "@/components/cart/cart"
import { useCurrentUser } from "@/hooks/user"
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Divider, Form, Image, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react"
import { ImageOff, Trash } from "lucide-react"
import { useState } from "react"
import Regulations from "../polityka-prywatnosci/page"
import { RegisterWithTermsSchema } from "@/schemas/user"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { CheckoutData, CreatePaymentPage } from "@/actions/stripe/payment"

type FormFields = z.infer<typeof RegisterWithTermsSchema>

export default function CheckoutPage() {
    const user = useCurrentUser()
    const { register, handleSubmit, setError, watch
        , formState: { errors, isSubmitting } } = useForm<FormFields>({ resolver: zodResolver(RegisterWithTermsSchema),
            defaultValues: {
                name: user?.name || undefined,
                email: user?.email || undefined,
            }
         });

    const { cart, removeFromCart, calculateTotalPrice } = useCart()
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const onSubmit: SubmitHandler<FormFields> = async (data) => {        
        // Zbieranie ID i Type z koszyka
        const cartItems = cart.map(item => ({
            id: item.id,
            type: item.type
        }));


        // Tworzenie danych do wysłania, łączymy dane formularza z danymi koszyka
        const formData: CheckoutData = {
            ...data,
            cartItems
        };

        await CreatePaymentPage(formData);  
    }
        
    return (
        <main className="px-[10vw] pt-4">
            <div className="grid grid-cols-10">
                <div className="col-span-6">
                    <Card
                        radius="none"
                    >
                        <CardHeader>Dane Kupującego</CardHeader>
                        <Form
                            onSubmit={handleSubmit(onSubmit)}
                            validationBehavior="native"
                        >
                            <CardBody>
                                <Input {...register("name")}
                                    label="Imię i nazwisko"
                                    labelPlacement="outside"
                                    type="name"
                                    placeholder="Jack Sparrow"
                                    isClearable
                                    isDisabled={!!user || isSubmitting}
                                    isReadOnly={!!user}
                                    variant="bordered"
                                    radius="none"
                                    isInvalid={!!errors.name}
                                    errorMessage={errors.email?.message}
                                    autoComplete="name"
                                    value={user?.name || undefined}
                                    className="mb-4"
                                /> 
                                <Input {...register("email")}
                                    label="Email"
                                    labelPlacement="outside"
                                    type="email"
                                    placeholder="jack.sparrow@pirate.com"
                                    isRequired
                                    isClearable
                                    isDisabled={!!user || isSubmitting}
                                    isReadOnly={!!user}
                                    variant="bordered"
                                    radius="none"
                                    isInvalid={!!errors.email}
                                    errorMessage={errors.email?.message}
                                    autoComplete="email"
                                    value={user?.email || undefined}
                                />
                            </CardBody>
                            <Divider/>
                            <CardHeader>Podsumowanie zamówienia</CardHeader>
                            <CardBody>
                                {cart.map((item)=>(
                                    <div key={item.id} className="grid grid-cols-4 gap-4">
                                        <Image
                                            radius="none"
                                            fallbackSrc={<ImageOff/>}
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full aspect-square col-span-1"
                                        />
                                        <div className="col-span-2 flex flex-col">
                                            <span className="text-xl">{item.title}</span>
                                            <span>{item.price * item.quantity} zł</span>
                                        </div>
                                        <div className="col-span-1 justify-end flex">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                isDisabled={isSubmitting}
                                                variant="light"
                                                onPress={()=>{
                                                    removeFromCart(item.id, item.type)
                                                }}
                                            >
                                                <Trash/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardBody>
                            <Divider/>
                            <CardBody>
                                <div className="flex justify-between">
                                    <span>Razem:</span>
                                    <span>{calculateTotalPrice()} zł</span>
                                </div>
                            </CardBody>
                            <Divider/>                         
                            <CardBody>
                                <Checkbox {...register("terms")}
                                    isRequired
                                    color="success"
                                    defaultChecked
                                    isInvalid={!!errors.terms}
                                    isDisabled={isSubmitting}
                                    className="max-w-full"
                                >
                                    <span className="text-sm">Akceptuję politykę prywatności oraz regulamin Akademii Wilka</span>
                                </Checkbox>
                            </CardBody>
                            <Divider/>
                            <CardBody>
                                <p className="text-sm">
    Twoje dane osobowe będą użyte do przetworzenia zamówienia, ułatwienia korzystania ze strony internetowej oraz innych celów opisanych w naszej
                                    <span onClick={onOpen} className="cursor-pointer text-primary text-sm">
                                        {" "}Polityce prywatności i regulaminie
                                    </span>
                                </p>
                            </CardBody>
                            <CardFooter>
                                <Button
                                    fullWidth
                                    radius="none"
                                    color="success"
                                    type="submit"
                                    className="text-white"
                                    isLoading={isSubmitting}
                                    isDisabled={!watch("email") || !!errors.email || !watch("terms") || (calculateTotalPrice() === 0) || isSubmitting}
                                >
                                    {isSubmitting ? "Przekierowanie..." : "Przejdź do płatności"}
                            </Button>
                            </CardFooter>
                        </Form>
                    </Card>
                </div>
            </div>
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                size="5xl"
                scrollBehavior="inside"    
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Polityka Prywatności i Regulamin</ModalHeader>
                            <ModalBody>
                                <Regulations/>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    zamknij
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </main>
    )
}