import MensagemResponse from "@/app/interface/MensagemResponse";
import { api } from "@/app/service/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchdata = async (idConversa : string | undefined) : Promise<MensagemResponse[]> => {
    const response = await api.get(`/mensagens/${idConversa}`);
    console.log(response.data);
    

    return response.data;
}

export function useMensagemData(idConversa : string | undefined) {
    return useQuery({
        queryFn: () => fetchdata(idConversa),
        queryKey: ["mensagem-data", idConversa],
        refetchInterval: 2000
    });
}
