import { UsuarioProps } from "@/app/interface/UsuarioProps";
import { api, API_URL } from "@/app/service/api";
import {useQuery} from "@tanstack/react-query";

const fetchdata = async () : Promise<UsuarioProps[]> => {
    const response = await api.get(`/usuarios`);

    return response.data;
}

export function useUsuarioData() {

    return useQuery({
        queryFn: () => fetchdata(),
        queryKey: ["usuario-data"],
        retry: 2
    });
}