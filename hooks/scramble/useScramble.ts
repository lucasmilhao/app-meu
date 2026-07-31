import { api, API_URL } from "@/app/service/api"
import { useQuery } from "@tanstack/react-query";

export interface ScrambleProps {
    scramble : string,
    svg : string
}

const fetchData = async () : Promise<ScrambleProps> => {
    const response = await api.get(`/scrambles/333`);

    return response.data;
}


export default function useScramble() {
    return useQuery({
        queryFn: fetchData,
        queryKey: ['scramble-data'],
        retry: 2
    });
}