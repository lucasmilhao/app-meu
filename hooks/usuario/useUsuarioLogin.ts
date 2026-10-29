import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsuarioLoginRequest } from "@/app/interface/UsuarioLoginRequest";
import { api, salvarTokenAutenticacao } from "@/app/service/api";

const fetchdata = async (request : UsuarioLoginRequest) => {
    const response = await api.post("/auth/login", request);

    await salvarTokenAutenticacao(response.data.token);

    return response.data;
}

export function useUsuarioLogin() {
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