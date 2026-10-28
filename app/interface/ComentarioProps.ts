import PostagemProps from "./PostagemProps";
import { UsuarioProps } from "./UsuarioProps";

export default interface ComentarioProps {
    id : string,
    usuario : UsuarioProps,
    postagem : PostagemProps,
    conteudo : string,
    createdAt : string,
}