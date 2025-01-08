"use client"

import { UpdateCoursePrice } from "@/actions/course-teacher/price"
import { formatPrice } from "@/lib/format"
import { PriceSchema } from "@/schemas/course"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Card, CardBody, CardFooter, Input } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { startTransition } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

type FormFields = z.infer<typeof PriceSchema>

const PriceCard = ({
    courseId,
    price,
} : {
    courseId:string,
    price:number | null,
}) => {
    const router = useRouter()
    const { register, handleSubmit, setError, watch, formState: { errors, isSubmitting }} = useForm<FormFields>({
        defaultValues: price? {price} : undefined,
        resolver: zodResolver(PriceSchema)
    })

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        startTransition(async () => {
            await UpdateCoursePrice(data, courseId)
            .then(()=>{
                toast.success("Cenę zmieniono pomyślnie")
                router.refresh()
            })
            .catch((error)=>{
                setError("price", {message: error.message})
                toast.error(error.message)
            })
        })
    }
    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardBody>
                    <Input 
                        {...register("price")}                        
                        label="Cena"
                        labelPlacement="outside"
                        type="number"
                        placeholder="PLN 0"
                        startContent={<span className={`text-sm ${errors.price && 'text-danger'}`}>PLN</span>}
                        disabled={isSubmitting}
                        variant="bordered"
                        isInvalid={errors.price ? true : false}
                        errorMessage={errors.price?.message}
                        min={0}
                    />
                </CardBody>
                <CardFooter>
                    <Button
                        type="submit"
                        color="primary"
                        isDisabled={isSubmitting || watch("price") === price || !!errors.price}
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? "Przetwarzanie..." : "Zmień cenę"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
export default PriceCard