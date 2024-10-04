"use client";

import { registerNewUser } from "@/actions/auth/register";
import { RegisterSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { startTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from 'zod'

type FormFields = z.infer<typeof RegisterSchema>

const RegisterForm = () => {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    startTransition(async ()=>{
      registerNewUser(data)
        .then(()=>{
          toast.success("Rejestracja udana! Wysłano e-mail weryfikacyjny")
        })
        .catch((error)=>{
          setError("email", { message: error.message })
          toast.error(error.message)
        })
    })
    
    {/* 
    try {
      await new Promise ((resolve)=> setTimeout(resolve, 5000))
      throw new Error()
      console.log(data)
    } catch(error) {
      setError("email", {message: "Ten email jest juz zajety"})
    }
    */}
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-[2vh]">
      <Input {...register("email")} 
        label="E-mail" 
        labelPlacement="outside"
        type="email" 
        placeholder="jack.sparrow@pirate.com"
        isRequired
        isClearable
        disabled={isSubmitting}
        variant="bordered"
        isInvalid={errors.email ? true: false}
        errorMessage={errors.email?.message}
        className="max-w-s mb-10"
      />
      
      <Input {...register("name")} 
        isClearable
        disabled={isSubmitting}
        variant="bordered"
        label="Imię i nazwisko"
        labelPlacement="outside"
        type="text"
        placeholder="Jack Sparrow"
        className="mb-10 max-w-s"
      />
      <Button type="submit" color="primary" fullWidth disabled={isSubmitting} isLoading={isSubmitting}>
        {isSubmitting ? "Ładowanie..." : "Załóż konto"}
      </Button>
    </form>
  );
};

export default RegisterForm;

{/*
"use client";

import { RegisterSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition, useState } from "react";
import { register } from "@/actions/auth/register";
import RenderResultMessage from "@/components/render-result-message";

interface RegisterFormProps {
  onRegistered?: (email: string) => void; // Callback wywoływany po udanej rejestracji
}

const RegisterForm = ({ onRegistered }: RegisterFormProps) => {
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setResult(null);
    startTransition(() => {
      register(values).then((data) => {
        setResult({ success: data.success, message: data.message });

        // Jeśli rejestracja się powiedzie, wywołujemy onRegistered (przekierowanie do checkoutu)
        if (data.success && onRegistered) {
          onRegistered(values.email);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[1vh] py-[1vh]">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię i Nazwisko</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="John Doe"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  type="password"
                  placeholder="********"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center space-y-[1vh]">
          <Button type="submit" disabled={isPending}>
            Załóż Konto
          </Button>
        </div>
        {RenderResultMessage(result)}
      </form>
    </Form>
  );
};

export default RegisterForm;
*/}