"use client"

import z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { buyerSchema } from "@/lib/schemas/buyer.schema";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";



export default function NewBuyerPage() {
    
    const router = useRouter();

    const { register, handleSubmit } = useForm<any>({
        resolver: zodResolver(buyerSchema)
    })

    const onSubmit = async (data: FormData)=> {
        await api.post("/buyers", data);
        toast.success("Created new buyer succesfully")
        router.push("/buyers");
    }

    return (
        <div className="max-w-md space-y-6">
            <h1 className="text-2xl font-bold">Create Buyer</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input placeholder="Name" {...register("name")} />
                <Input placeholder="Phone" {...register("phone")} />
                <Input placeholder="Address" {...register("address")} />
                <Input placeholder="Notes" {...register("notes")} />

                <Button type="submit">
                    Create Buyer
                </Button>
            </form>
        </div>
    )
}

