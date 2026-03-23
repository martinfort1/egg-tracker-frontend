import { api } from "@/lib/api";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then(res => res.data)

export function useSales(period?: string){
    const { data, error, isLoading, mutate } =useSWR(
        `/sales/?period=${period || ""}`,
        fetcher
    )

    return {
        sales: data || [],
        isLoading,
        error,
        refresh: mutate
    }
}