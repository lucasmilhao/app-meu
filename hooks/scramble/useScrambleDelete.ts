import { api } from "@/app/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const fetchData = async (idScramble : string | undefined) => {
    const response = await api.delete(`/scrambles/${idScramble}`);

    return response.data;
}

export function useScrambleDelete() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchData,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["scramble-data"]});
        }
    });
}