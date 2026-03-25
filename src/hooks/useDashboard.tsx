import { api } from "@/lib/api";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useDashboard ( period?: string) {
    const {data, isLoading, error} = useSWR(
        `/sales/dashboard${period ? `?period=${period}`: ""}`,
        fetcher
    );

    return{
        data,
        isLoading,
        error
    }
}