import { api } from "@/app/service/api";
import { ScrambleProps } from "./useScramble";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface ScrambleEditRequest {
    idScramble : string,
    scramble : string,
    solution : string
}
const fetchdata = async (request : ScrambleEditRequest) : Promise<ScrambleProps> => {
    const response = await api.put(`/scrambles/${request.idScramble}`, request);

    return response.data;
}

export function useScrambleEdit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: (result : ScrambleProps) => {
            queryClient.invalidateQueries({queryKey : ["scramble-data", result.id]});
        }
    });
}