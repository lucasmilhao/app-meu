import { UsuarioProps } from "@/app/interface/UsuarioProps";
import { api } from "@/app/service/api";
import {useMutation, useQuery} from "@tanstack/react-query";

const fetchdata = async (emailUsuario : string) : Promise<UsuarioProps> => {
    const response = await api.get(`/usuarios/email/${emailUsuario}`);

    return response.data;
}

export function useUsuarioemailData() {

    return useMutation({
        mutationFn: fetchdata,
        retry: 2
    });
}