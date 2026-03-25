import { api } from "@/lib/api";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useAnalytics ( period?: string) {
    const {data, isLoading, error} = useSWR(
        `/sales/analytics${period ? `?period=${period}`: ""}`,
        fetcher
    );
    
    return{
        analytics: data || [],
        isLoading,
        error
    }
}