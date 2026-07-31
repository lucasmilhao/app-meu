import { UsuarioEditRequest } from "@/app/interface/UsuarioEditRequest";
import { UsuarioProps } from "@/app/interface/UsuarioProps";
import { api } from "@/app/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const fetchdata = async (request : UsuarioEditRequest) : Promise<UsuarioProps> => {
    const response = await api.put(`/usuarios/${request.id}`, request);

    return response.data;
}

export function useUsuarioEdit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["usuario-data"]})
        }
    });
}