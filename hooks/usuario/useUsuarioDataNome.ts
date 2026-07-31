import { UsuarioProps } from "@/app/interface/UsuarioProps";
import { api } from "@/app/service/api";
import {useQuery} from "@tanstack/react-query";
 
const fetchdata = async (nomeUsuario : string) : Promise<UsuarioProps[]> => {
    const response = await api.get(`/usuarios/nome/${nomeUsuario}`);

    return response.data;
}

export function useUsuarioNomeData(nomeUsuario : string) {

    return useQuery({
        queryFn: () => fetchdata(nomeUsuario),
        queryKey: ["usuario-nome-data", nomeUsuario],
        retry: 2
    });
}