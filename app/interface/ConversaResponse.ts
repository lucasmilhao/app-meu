import { UsuarioProps } from "./UsuarioProps";

export default interface ConversaResponseProps {
    idConversa : string,
    nome : string,
    idsUsuarios?: string[],
    participantes? : UsuarioProps[],
    isGrupo? : boolean,
    isPublico?: boolean
}