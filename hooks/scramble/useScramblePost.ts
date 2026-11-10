import { api } from "@/app/service/api";
import { ScrambleProps } from "./useScramble";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface ScrambleRequest {
    scramble : string,
    solution : string
}
const fetchdata = async (request : ScrambleRequest) : Promise<ScrambleProps> => {
    const response = await api.post(`/scrambles`, request);

    return response.data;
}

export function useScramblePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["scramble-data"]});
        }
    });
}