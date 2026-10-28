import ComentarioProps from "./ComentarioProps";
import { ScrambleProps } from "./ScrambleProps";
import { UsuarioProps } from "./UsuarioProps";

export default interface PostagemProps {
    id : string,
    descricao : string,
    scramble : ScrambleProps,
    usuario : UsuarioProps,
    createdAt : string,
    curtidas : number,
    comentarios : ComentarioProps[],
    caminhoImagem : string
}