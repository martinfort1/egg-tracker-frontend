"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { saleSchema } from "@/lib/schemas/sales.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function NewSalePage() {

    const router = useRouter();
    
    const [buyers, setBuyers] = useState<any[]>([])
    const [total, setTotal] = useState(0);

    const { register, handleSubmit, watch} = useForm({
        resolver: zodResolver(saleSchema),
        defaultValues: {
            Extra: 0,
            N1: 0,
            N2: 0,
            N3: 0,
            N4: 0
        }
    });

    useEffect( () => {
        const fetchBuyers = async ()  => {
            try {
                const res = await api.get("/buyers");
                setBuyers(res.data);
            } catch(err){
                console.error(err);
                toast.error("Fetching buyers failed")
            }
        };

        fetchBuyers();
    }, [])

    const values = watch()

    useEffect(() => {
        const totalCalculation = 
        values.Extra * values.ExtraPrice +
        values.N1 * values.N1Price +
        values.N2 * values.N2Price +
        values.N3 * values.N3Price +
        values.N4 * values.N4Price;

        setTotal( totalCalculation || 0 );
    }, [values]);

    const onSubmit = async( data: any) => {

        try{
            await api.post("/sales", data);
            toast.success('Sale created succesfully')
            router.push("/sales");
        } catch (err){
            console.error(err)
            toast.error('Faled to create sale');
        }

    }

    return (
        <div className="max-w-lg space-y-6">
            <h1 className="text-2xl font-bold">New Sale</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <label>Client</label>
                <select {...register("buyerId")} className="border p-2 w-full">
                    <option>Select buyer</option>

                    {buyers.map((buyer) => (
                        <option key={buyer.id} value={buyer.id}>
                            {buyer.name}
                        </option>
                    ))}
                </select>
                <Button className="flex text-sm justify-center max-w-72 rounded-full  bg-green-500 border hover:bg-green-600 hover:cursor-pointer">
                    <Link href="/buyers/new" className="flex">
                    <Plus />
                    To add a new buyer click here
                    </Link>
                </Button>

                <label>Extra quantity</label>
                <Input placeholder="Extra Quantity" type="number" {...register("Extra",{valueAsNumber:true})}/>
                <Input placeholder="Extra Price" type="number" {...register("ExtraPrice",{valueAsNumber:true})}/>

                <label>N1 quantity</label>
                <Input placeholder="N1 Quantity" type="number" {...register("N1",{valueAsNumber:true})}/>
                <Input placeholder="N1 Price" type="number" {...register("N1Price",{valueAsNumber:true})}/>

                <label>N2 quantity</label>
                <Input placeholder="N2 Quantity" type="number" {...register("N2",{valueAsNumber:true})}/>
                <Input placeholder="N2 Price" type="number" {...register("N2Price",{valueAsNumber:true})}/>

                <label>N3 quantity</label>
                <Input placeholder="N3 Quantity" type="number" {...register("N3",{valueAsNumber:true})}/>
                <Input placeholder="N3 Price" type="number" {...register("N3Price",{valueAsNumber:true})}/>

                <label>N4 quantity</label>
                <Input placeholder="N4 Quantity" type="number" {...register("N4",{valueAsNumber:true})}/>
                <Input placeholder="N4 Price" type="number" {...register("N4Price",{valueAsNumber:true})}/>

                <Input
                placeholder="Amount Paid"
                type="number"
                {...register("amountPaid",{valueAsNumber:true})}
                />

                <div>
                    Total: ${total}
                </div>

                <Button type="submit">
                    Create sale
                </Button>
            </form>
        </div>
    )

}