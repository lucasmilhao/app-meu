import { UsuarioProps } from "@/app/interface/UsuarioProps";
import { api } from "@/app/service/api";
import {useQuery} from "@tanstack/react-query";
 
const fetchdata = async (idUsuario : string | undefined) : Promise<UsuarioProps> => {
    const response = await api.get(`/usuarios/${idUsuario}`);

    return response.data;
}

export function useUsuarioDataId(idUsuario : string | undefined) {

    return useQuery({
        queryFn: () => fetchdata(idUsuario),
        queryKey: ["usuario-id-data", idUsuario],
        retry: 2
    });
}