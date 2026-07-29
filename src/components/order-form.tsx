"use client"

import { useEffect, useState } from "react";
import { Button } from "./ui/button"
import { useForm } from "react-hook-form";
import { orderSchema } from "@/lib/schemas/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { PriceInput } from "./ui/price-input";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type OrderFormProps = {
    initialData?: any
    isEdit: boolean
}

const WEEKDAYS = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
] as const;

function getDefaultValues(initialData?: any) {
    return {
        buyerId: initialData?.buyerId != null ? String(initialData.buyerId) : "",
        date: initialData?.date
            ? new Date(initialData.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],

        Extra: initialData?.Extra ?? 0,
        N1: initialData?.N1 ?? 0,
        N2: initialData?.N2 ?? 0,
        N3: initialData?.N3 ?? 0,
        N4: initialData?.N4 ?? 0,

        ExtraPrice: initialData?.ExtraPrice ?? 0,
        N1Price: initialData?.N1Price ?? 0,
        N2Price: initialData?.N2Price ?? 0,
        N3Price: initialData?.N3Price ?? 0,
        N4Price: initialData?.N4Price ?? 0,

        recurring: initialData?.recurring ?? false,
        recurringDays: initialData?.recurringDays ?? [],
    }
}

export default function OrderForm({ initialData, isEdit }: OrderFormProps) {

const router = useRouter();

const [buyers, setBuyers] = useState<any[]>([])
const [total, setTotal] = useState(0);
const [isSubmitting, setIsSubmitting] = useState(false);

const { register, handleSubmit, watch, setValue, reset, formState: { errors }, control } =
  useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: getDefaultValues(initialData),
  });

useEffect(() => {
    if (initialData) {
        reset(getDefaultValues(initialData))
    }
    console.log("buyerId", watch("buyerId"));
}, [initialData, reset])

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
const recurring = watch("recurring")
const recurringDays = watch("recurringDays") ?? []

const toggleRecurringDay = (day: string) => {
    const updatedDays = recurringDays.includes(day)
        ? recurringDays.filter((d: any) => d !== day)
        : [...recurringDays, day]

    setValue("recurringDays", updatedDays)
}

useEffect(() => {
    const totalCalculation = 
    values.Extra * values.ExtraPrice +
    values.N1 * values.N1Price +
    values.N2 * values.N2Price +
    values.N3 * values.N3Price +
    values.N4 * values.N4Price;

    setTotal( totalCalculation || 0 );
}, [values]);



const onSubmit = async (data: any) => {
    setIsSubmitting(true);
  
    try {
      if (isEdit) {
        await api.patch(
          `/orders/${initialData.id}`,
          data
        );

        toast.success("Order updated successfully");
        router.push(`/orders/${initialData.id}`);
      } else {
        const res = await api.post(
          "/orders",
          data
        );

        toast.success("Order created successfully");
        router.push(`/orders/${res.data.id}`);
      }
    } catch {
      toast.error(
        isEdit
          ? "Failed to update order"
          : "Failed to create order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
return(
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Client Selection */}
        <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Client</label>
            <select 
                {...register("buyerId")} 
                value={watch("buyerId") || ""}
                className="w-full bg-white/20 border border-white/30 text-white rounded-xl p-3 focus:border-indigo-400 focus:ring-indigo-400/20 focus:outline-none transition [&>option]:bg-white [&>option]:text-slate-900"
            >
                <option value="" className="bg-slate-900 text-white">Select buyer</option>
                {buyers.map((buyer) => (
                    <option key={buyer.id} value={buyer.id} className="bg-slate-900 text-white">
                        {buyer.name}
                    </option>
                ))}
            </select>
            {errors.buyerId && <p className="text-red-300 text-xs">{String(errors.buyerId?.message)}</p>}
        </div>

        {/* Sale Date */}
        <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Order Date</label>
            <Input
                type="date"
                {...register("date")}
                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
            />
        </div>

        <div className="flex justify-center">
            <Link href="/buyers/new">
                <Button className="bg-linear-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 rounded-full flex items-center gap-2 transition active:scale-95">
                    <Plus size={18} />
                    Add New Buyer
                </Button>
            </Link>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            {/* Extra */}
            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-sm font-bold text-white">Extra</h3>
                <div>
                    <label className="text-xs font-semibold text-indigo-200 mb-1 block">Quantity</label>
                    <Input 
                        placeholder="0" 
                        type="number"
                        step="0.5"
                        {...register("Extra", {valueAsNumber: true})}
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-indigo-200 mb-1 block">Price per Unit</label>
                    <PriceInput
                        placeholder="0"
                        control={control}
                        name="ExtraPrice"
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                    />
                </div>
            </div>

            {/* N1 */}
            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-sm font-bold text-white">N1</h3>
                <div>
                    <label className="text-xs font-semibold text-indigo-200 mb-1 block">Quantity</label>
                    <Input 
                        placeholder="0" 
                        type="number"
                        step="0.5"
                        {...register("N1", {valueAsNumber: true})}
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-indigo-200 mb-1 block">Price per Unit</label>
                    <PriceInput
                        placeholder="0"
                        control={control}
                        name="N1Price"
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                    />
                </div>
            </div>

            {/* N2 */}
            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-sm font-bold text-white">N2</h3>
                <div>
                    <label className="text-xs font-semibold text-indigo-200 mb-1 block">Quantity</label>
                    <Input 
                        placeholder="0" 
                        type="number"
                        step="0.5"
                        {...register("N2", {valueAsNumber: true})}
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-indigo-200 mb-1 block">Price per Unit</label>
                    <PriceInput
                        placeholder="0"
                        control={control}
                        name="N2Price"
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                    />
                </div>
            </div>

            {/* N3 */}
            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-sm font-bold text-white">N3</h3>
                <div>
                    <label className="text-xs font-semibold text-indigo-200 mb-1 block">Quantity</label>
                    <Input 
                        placeholder="0" 
                        type="number"
                        step="0.5"
                        {...register("N3", {valueAsNumber: true})}
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-indigo-200 mb-1 block">Price per Unit</label>
                    <PriceInput
                        placeholder="0"
                        control={control}
                        name="N3Price"
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                    />
                </div>
            </div>

            {/* N4 */}
            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                <h3 className="text-sm font-bold text-white">N4</h3>
                <div>
                    <label className="text-xs font-semibold text-indigo-200 mb-1 block">Quantity</label>
                    <Input 
                        placeholder="0" 
                        type="number"
                        step="0.5"
                        {...register("N4", {valueAsNumber: true})}
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                    />
                </div>
                <div>
                    <label className="text-xs font-semibold text-indigo-200 mb-1 block">Price per Unit</label>
                    <PriceInput
                        placeholder="0"
                        control={control}
                        name="N4Price"
                        className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                    />
                </div>
            </div>
        </div>

        {/* Recurring Order Toggle */}
        <div className="space-y-2 pt-4 border-t border-white/10">
            <label className="text-sm font-semibold text-white">Recurring Order?</label>
            <div className="flex gap-2">
                <Button
                    type="button"
                    onClick={() => {
                        setValue("recurring", false)
                        setValue("recurringDays", [])
                    }}
                    className={`flex-1 transition ${
                        !recurring
                            ? "bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-700 text-white"
                            : "bg-white/10 text-slate-300 hover:bg-white/20 cursor-pointer"
                    }`}
                >
                    No
                </Button>
                <Button
                    type="button"
                    onClick={() => setValue("recurring", true)}
                    className={`flex-1 transition ${
                        recurring
                            ? "bg-linear-to-r from-green-500 via-green-700 to-green-900 hover:from-green-700 hover:to-green-800 text-white"
                            : "bg-white/10 text-slate-300 hover:bg-white/20 cursor-pointer"
                    }`}
                >
                    Yes
                </Button>
            </div>
        </div>

        {recurring && (
            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                <label className="text-sm font-semibold text-white">Repeat on:</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {WEEKDAYS.map((day) => (
                        <label
                            key={day}
                            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 hover:bg-white/5 transition"
                        >
                            <input
                                type="checkbox"
                                checked={recurringDays.includes(day)}
                                onChange={() => toggleRecurringDay(day)}
                                className="h-4 w-4 rounded border-white/30 bg-white/20 text-indigo-500 focus:ring-indigo-400/20 focus:ring-offset-0"
                            />
                            <span className="text-sm text-indigo-200">{(day.toLowerCase().charAt(0).toUpperCase() + day.toLowerCase().slice(1))}</span>
                        </label>
                    ))}
                </div>
                {errors.recurringDays && (
                    <p className="text-red-300 text-xs">{String(errors.recurringDays?.message)}</p>
                )}
            </div>
        )}

        {/* Total Display & Debt Calculation */}
        <div className="space-y-3 bg-linear-to-r from-orange-600/30 to-yellow-600/30 border border-orange-400/30 rounded-xl p-4">
            <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">Total:</span>
                <span className="text-2xl font-black text-orange-200">{formatCurrency(total)}</span>
            </div>
        </div>

        {/* Submit Button */}
        <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition active:scale-95 rounded-xl py-6 text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isSubmitting
                ? isEdit ? "Updating..." : "Creating..."
                : isEdit ? "Update Order" : "Create Order"}
        </Button>
    </form>
    )
}