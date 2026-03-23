import { api } from "@/lib/api";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useSummary ( period?: string) {
    const {data, isLoading} = useSWR(
        `/sales/summary${period ? `?period=${period}`: ""}`,
        fetcher
    );

    return{
        summary: data,
        isLoading
    }
}