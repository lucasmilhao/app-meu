import ConversaResponseProps from "@/app/interface/ConversaResponse";
import { Palette, ThemePalette } from "@/constants/pallete";
import { useMensagemData } from "@/hooks/chat/mensagem/useMensagemData";
import { useUsuarioLogado } from "@/hooks/usuario/useUsuarioLogado";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
} from "react-native";
import { formatarTempoRelativo } from "./PostCard";


export function ConversaCard({
    idConversa,
    nome,
    participantes,
    isGrupo,
}: ConversaResponseProps) {
    const router = useRouter();

    const { data: mensagens } = useMensagemData(idConversa);
    const { data: usuarioLogado } = useUsuarioLogado();

    const user =
        participantes?.at(0)?.id === usuarioLogado?.id
            ? participantes?.at(1)
            : participantes?.at(0);

            
    const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
    const styles = useMemo(() => makeStyles(colors), [colors]);

    const ultimaMensagem = mensagens?.at(-1);

    const avatarFallback =
        user?.nome?.charAt(0)?.toUpperCase() || "C";

    const previewText =
        ultimaMensagem?.texto || "Nenhuma mensagem ainda";

    const nomeConversa = isGrupo ? nome : user?.nome;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {router.push({pathname:"/(screens)/conversa", params: {idConversa : idConversa}})}}
            style={[
                styles.container,
                {
                    backgroundColor: colors.bgPrimary,
                    borderBottomColor: colors.borderColor,
                },
            ]}
        >
            {/* Avatar */}
            <View
                style={[
                    styles.avatar,
                    {
                        backgroundColor: colors.bgTertiary,
                        borderColor: colors.borderColor,
                    },
                ]}
            >
                {user?.picture && !isGrupo ? (
                    <Image
                        source={{ uri: user.picture }}
                        style={styles.avatarImage}
                        resizeMode="cover"
                    />
                ) : (
                    <Text
                        style={[
                            styles.avatarFallback,
                            { color: colors.accent },
                        ]}
                    >
                        {avatarFallback}
                    </Text>
                )}
            </View>

            {/* Conteúdo */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.name,
                            { color: colors.textPrimary },
                        ]}
                    >
                        {nomeConversa || "Conversa"}
                    </Text>

                    {ultimaMensagem && (
                        <Text
                            style={[
                                styles.time,
                                { color: colors.textMuted },
                            ]}
                        >
                            {formatarTempoRelativo(
                                ultimaMensagem.mandado
                            )}
                        </Text>
                    )}
                </View>

                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                        styles.preview,
                        { color: colors.textSecondary },
                    ]}
                >
                    {previewText}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const makeStyles = (c : ThemePalette) => StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        gap: 12,
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },

    avatarImage: {
        width: "100%",
        height: "100%",
        borderRadius: 27,
    },

    avatarFallback: {
        fontSize: 21,
        fontWeight: "700",
    },

    content: {
        flex: 1,
        justifyContent: "center",
        gap: 6,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
    },

    name: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
    },

    time: {
        fontSize: 11,
    },

    preview: {
        fontSize: 13,
    },
});