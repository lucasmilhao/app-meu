import { api, API_URL } from "@/app/service/api"
import { useQuery } from "@tanstack/react-query";

export interface ScrambleProps {
    scramble : string,
    svg : string
}

const fetchData = async (puzzle : string) : Promise<ScrambleProps> => {
    const response = await api.get(`/scrambles/${puzzle}`);

    return response.data;
}


export default function useScramble(puzzle: string) {
    return useQuery({
        queryFn: () => fetchData(puzzle),
        queryKey: ['scramble-data'],
        retry: 2
    });
}