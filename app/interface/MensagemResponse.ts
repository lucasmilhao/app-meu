import type { UsuarioProps } from "./UsuarioProps";

export default interface MensagemResponse {
    id : string,
    texto : string,
    sender : UsuarioProps,
    conversa : string,
    isVisto : boolean,
    mandado : string
}