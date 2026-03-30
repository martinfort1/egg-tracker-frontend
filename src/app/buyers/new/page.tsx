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

    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        resolver: zodResolver(buyerSchema)
    })

    const onSubmit = async (data: FormData)=> {
        await api.post("/buyers", data);
        toast.success("Created new buyer succesfully")
        router.push("/buyers");
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Create Buyer</h1>
                    <p className="text-indigo-200">Add a new buyer to your system</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Name</label>
                        <Input 
                            placeholder="Buyer name" 
                            {...register("name")} 
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.name && <p className="text-red-300 text-xs">{String(errors.name?.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Phone</label>
                        <Input 
                            placeholder="Phone number" 
                            {...register("phone")} 
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.phone && <p className="text-red-300 text-xs">{String(errors.phone?.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Address</label>
                        <Input 
                            placeholder="Street address" 
                            {...register("address")} 
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.address && <p className="text-red-300 text-xs">{String(errors.address?.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Notes</label>
                        <Input 
                            placeholder="Additional notes" 
                            {...register("notes")} 
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.notes && <p className="text-red-300 text-xs">{String(errors.notes?.message)}</p>}
                    </div>

                    <Button 
                        type="submit"
                        className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition active:scale-95 rounded-xl cursor-pointer"
                    >
                        Create Buyer
                    </Button>
                </form>
            </div>
        </div>
    )
}

