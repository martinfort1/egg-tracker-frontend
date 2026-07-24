"use client"

import OrderForm from "@/components/order-form"
import LoadSpin from "@/components/load-spin"
import { api } from "@/lib/api"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"



export default function EditOrderPage() {
    const { id } = useParams()
    const [order, setOrder] = useState<any>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrder = async() => {
            try{
                const res = await api.get(`/orders/${id}`)
                setOrder(res.data)
            } 
            catch(error){
                console.error(error);
                toast.error("Failed fetching order")
            } finally {
                setLoading(false)
            }
    }
    fetchOrder()
    }, [id])

    if (loading) return <LoadSpin />
    

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6">
            <div className="w-full max-w-2xl mx-auto space-y-6 bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Edit Order</h1>
                    <p className="text-indigo-200">Update order information</p>
                </div>

                {order && <OrderForm initialData={order} isEdit={true} />}

            </div>
        </div>
    )

}