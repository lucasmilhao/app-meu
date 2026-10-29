import { UsuarioProps } from "@/app/interface/UsuarioProps";
import { api } from "@/app/service/api";
import {useQuery} from "@tanstack/react-query";

const fetchdata = async (username : string) : Promise<UsuarioProps> => {
    const response = await api.get(`/usuarios/username/${username}`);

    return response.data;
}

export function useUsuarioUsername(username : string) {

    return useQuery({
        queryFn: () => fetchdata(username),
        queryKey: ["usuario-username-data", username],
        retry: 2
    });
}