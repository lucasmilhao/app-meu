import ConversaResponseProps from "@/app/interface/ConversaResponse";
import { api } from "@/app/service/api";
import { useQuery } from "@tanstack/react-query";

const fetchdata = async (idUsuario : string | undefined) : Promise<ConversaResponseProps[]> => {
    const response = await api.get(`/participantes/usuario/${idUsuario}`);
    console.log(response.data);
    

    return response.data;
}

export function useConversaDataUsuario(idUsuario : string | undefined) {
    return useQuery({
        queryFn: () => fetchdata(idUsuario),
        queryKey: ["conversas-usuario", idUsuario],
        enabled: Boolean(idUsuario),
    });
}