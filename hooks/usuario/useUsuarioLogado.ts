import { UsuarioProps } from "@/app/interface/UsuarioProps";
import { api } from "@/app/service/api";
import {useQuery} from "@tanstack/react-query";

const fetchdata = async () : Promise<UsuarioProps> => {
    const response = await api.get(`/usuarios/me`);

    return response.data;
}

export function useUsuarioLogado() {

    return useQuery({
        queryFn: fetchdata,
        queryKey: ["usuario-logado-data"],
        retry: 2
    });
}