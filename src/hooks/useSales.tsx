import { api } from "@/lib/api";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then(res => res.data)

export function useSales(period?: string, startDate?: string, endDate?: string){
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (period && !startDate && !endDate && period !== "all") params.set("period", period);

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const { data, error, isLoading, mutate } = useSWR(
        `/sales${queryString}`,
        fetcher
    );

    return {
        sales: data || [],
        isLoading,
        error,
        refresh: mutate
    }
}