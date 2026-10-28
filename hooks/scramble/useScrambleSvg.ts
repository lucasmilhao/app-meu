import { api, API_URL } from "@/app/service/api"
import { useQuery } from "@tanstack/react-query";

export interface ScrambleProps {
    scramble : string,
    svg : string
}

const fetchData = async (scramble : string) : Promise<string> => {
    const response = await api.get(`/scrambles/svg/${scramble}`);

    return response.data;
}


export default function useScrambleSvg(scramble : string) {
    return useQuery({
        queryFn: () => fetchData(scramble),
        queryKey: ['scramble-data'],
        retry: 2
    });
}