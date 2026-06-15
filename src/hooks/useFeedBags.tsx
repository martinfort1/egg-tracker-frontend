import { api } from "@/lib/api";
import useSWR from "swr";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useFeedBags () {
    const {data, isLoading, error} = useSWR(
        "/feed-bags/metrics/summary",
        fetcher
    );
    
    return{
        feedBags: data || [],
        isLoading,
        error
    }
}