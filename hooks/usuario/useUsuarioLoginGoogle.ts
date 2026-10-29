import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, salvarTokenAutenticacao } from "@/app/service/api";

const fetchdata = async (request : string | undefined) => {
    const response = await api.post("/auth/login/google", request);

    await salvarTokenAutenticacao(response.data.token);

    return response.data;
}

export function useUsuarioLoginGoogle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["usuario-data"] }),
                queryClient.invalidateQueries({ queryKey: ["usuario-logado-data"] }),
            ]);
        }
    });
}