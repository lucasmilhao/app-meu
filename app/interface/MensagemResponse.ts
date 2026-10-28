import type { UsuarioProps } from "./UsuarioProps";

export default interface MensagemResponse {
    id : string,
    texto : string,
    sender : UsuarioProps,
    conversa : string,
    visto : boolean,
    mandado : string
}