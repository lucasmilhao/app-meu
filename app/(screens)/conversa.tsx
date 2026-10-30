import { useEffect, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    ScrollView,
    useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import { useMensagemData } from "../../hooks/chat/mensagem/useMensagemData";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { useMensagemPost } from "../../hooks/chat/mensagem/useMensagemPost";
import { useConversaData } from "../../hooks/chat/conversa/useConversaData";
import { Palette, ThemePalette } from "@/constants/pallete";
import { UsuarioProps } from "../interface/UsuarioProps";
import MensagemRequest from "../interface/MensagemRequest";
import ConversaResponseProps from "../interface/ConversaResponse";
import ParticipantesRequest from "../interface/ParticipantesRequest";
import { Mensagem } from "@/components/Mensagem";
import { useParticipantesConversa } from "@/hooks/chat/conversa/useParticipantesConversa";
import { useRemoverParticipante } from "@/hooks/chat/conversa/useRemoverParticipante";
import { useConviteCreate } from "@/hooks/chat/conversa/useConviteCreate";
import { useConversaEdit } from "@/hooks/chat/conversa/useConversaEdit";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Conversa() {
    const { idConversa: paramId } = useLocalSearchParams<{
        idConversa: string;
    }>();

    const idConversa = Array.isArray(paramId) ? paramId[0] : paramId;

    const router = useRouter();

    const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
    const styles = useMemo(() => makeStyles(colors), [colors]);


    const { data: mensagens, isLoading: carregandoMensagens } =
        useMensagemData(idConversa);

    const { data: conversa } = useConversaData(idConversa);
    const insets = useSafeAreaInsets();

    const { data: usuarioLogado } = useUsuarioLogado();

    const { data: dataParticipantes } =
        useParticipantesConversa(idConversa);

    const enviaMensagem = useMensagemPost();
    const { mutate: removerParticipante } = useRemoverParticipante();
    const { mutate: criarConvite } = useConviteCreate();
    const { mutate: editarConversa } = useConversaEdit();

    const [texto, setTexto] = useState("");
    const [menuAberto, setMenuAberto] = useState(false);
    const [detalhesAbertos, setDetalhesAbertos] = useState(false);

    const listaRef = useRef<FlatList>(null);

    const qtdParticipantes = conversa?.participantes?.length ?? 0;

    const user =
        conversa?.participantes?.at(0)?.id === usuarioLogado?.id
            ? conversa?.participantes?.at(1)
            : conversa?.participantes?.at(0);

    const nomeConversa = conversa?.isGrupo
        ? conversa?.nome
        : user?.nome;

    const isAdmin = dataParticipantes?.find(
        (participante) =>
            participante.usuario.id === usuarioLogado?.id
    )?.isAdmin;

    useEffect(() => {
        if (!mensagens?.length) return;

        const timeout = setTimeout(() => {
            listaRef.current?.scrollToEnd({ animated: true });
        }, 100);

        return () => clearTimeout(timeout);
    }, [mensagens]);

    const enviar = () => {
        if (!texto.trim() || enviaMensagem.isPending) return;

        const props: MensagemRequest = {
            texto: texto.trim(),
            idSender: usuarioLogado?.id,
            idConversa,
        };

        enviaMensagem.mutate(props, {
            onSuccess: () => {
                setTexto("");
            },
            onError: () => {
                Alert.alert(
                    "Erro",
                    "Não foi possível enviar a mensagem. Tente novamente."
                );
            },
        });
    };

    const editar = () => {
        if (!idConversa) return;

        const props: ConversaResponseProps = {
            idConversa,
            nome: conversa?.nome,
            isPublico: !conversa?.isPublico,
        };

        editarConversa(props, {
            onSuccess: () => {
                setMenuAberto(false);

                Alert.alert(
                    "Conversa atualizada",
                    conversa?.isPublico
                        ? "O grupo agora é privado."
                        : "O grupo agora é público."
                );
            },
            onError: () => {
                Alert.alert(
                    "Erro",
                    "Não foi possível alterar a privacidade do grupo."
                );
            },
        });
    };

    const sairDaConversa = () => {
        Alert.alert(
            qtdParticipantes > 2
                ? "Sair do grupo?"
                : "Remover conversa?",
            qtdParticipantes > 2
                ? "Você deseja sair desta conversa?"
                : "Você deseja sair desta conversa?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Confirmar",
                    style: "destructive",
                    onPress: () => {
                        const props: ParticipantesRequest = {
                            idConversa: conversa?.idConversa,
                            idUsuario: usuarioLogado?.id,
                        };

                        removerParticipante(props, {
                            onSuccess: () => {
                                router.replace("/");
                            },
                            onError: () => {
                                Alert.alert(
                                    "Erro",
                                    "Não foi possível sair da conversa."
                                );
                            },
                        });
                    },
                },
            ]
        );
    };

    const compartilharGrupo = () => {
        if (!idConversa) return;

        criarConvite(idConversa, {
            onSuccess: async (response: any) => {
                try {
                    await Clipboard.setStringAsync(response.link);

                    setMenuAberto(false);

                    Alert.alert(
                        "Convite copiado",
                        "O link do grupo foi copiado para a área de transferência."
                    );
                } catch {
                    Alert.alert(
                        "Erro",
                        "Não foi possível copiar o link."
                    );
                }
            },
            onError: () => {
                Alert.alert(
                    "Erro",
                    "Não foi possível criar o convite."
                );
            },
        });
    };

    const abrirPerfil = (username?: string) => {
        if (!username) return;

        router.push({
            pathname: "/(screens)/user-profile",
            params: { username },
        });
    };

    const renderAvatarParticipante = (
        participante: NonNullable<
            typeof conversa
        >["participantes"][number],
        index: number
    ) => (
        <Image
            key={participante.id ?? index}
            source={
                participante.picture
                    ? { uri: participante.picture }
                    : 'require("../../assets/default-avatar.png")'
            }
            style={[
                styles.participanteAvatar,
                {
                    borderColor: colors.cardBg,
                    marginLeft: index === 0 ? 0 : -12,
                },
            ]}
        />
    );

    return (
        <SafeAreaView

            style={[
                styles.screen,
                {
                    backgroundColor: colors.bgPrimary,
                },
            ]}
            edges={["top", "bottom"]}
        >
            <KeyboardAvoidingView

                style={styles.keyboardContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
            >
                {/* Cabeçalho */}
                <View
                    style={[
                        styles.header,
                        {
                            backgroundColor: colors.bgSecondary,
                            borderBottomColor: colors.borderColor,
                        },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                        accessibilityLabel="Voltar"
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={colors.textPrimary}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.chatInfo}
                        activeOpacity={0.75}
                        onPress={() => setDetalhesAbertos(true)}
                    >
                        <View style={styles.avatars}>
                            {qtdParticipantes > 2
                                ? conversa?.participantes
                                    ?.slice(0, 3)
                                    .map(renderAvatarParticipante)
                                : (
                                    <Image
                                        source={
                                            user?.picture
                                                ? { uri: user.picture }
                                                : 'require("../../assets/default-avatar.png")'
                                        }
                                        style={[
                                            styles.singleAvatar,
                                            {
                                                borderColor: colors.borderColor,
                                            },
                                        ]}
                                    />
                                )}
                        </View>

                        <View style={styles.chatTitleContainer}>
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.chatTitle,
                                    { color: colors.textPrimary },
                                ]}
                            >
                                {nomeConversa || "Conversa"}
                            </Text>

                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.participantsText,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                {conversa?.participantes
                                    ?.slice(0, 3)
                                    .map((p: UsuarioProps) => p.nome)
                                    .join(", ")}

                                {qtdParticipantes > 3
                                    ? ` e mais ${qtdParticipantes - 3}`
                                    : ""}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionsButton}
                        onPress={() => setMenuAberto(true)}
                        accessibilityLabel="Opções da conversa"
                    >
                        <Ionicons
                            name="ellipsis-vertical"
                            size={23}
                            color={colors.textPrimary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Lista de mensagens */}
                <View style={styles.messagesArea}>
                    {carregandoMensagens ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator
                                size="large"
                                color={colors.accent}
                            />
                        </View>
                    ) : (
                        <FlatList
                            ref={listaRef}
                            data={mensagens ?? []}
                            keyExtractor={(item, index) =>
                                String(item.id ?? index)
                            }
                            renderItem={({ item }) => (
                                <Mensagem
                                    {...item}
                                    isOwnMessage={
                                        item.sender?.id === usuarioLogado?.id
                                    }
                                    onPressProfile={abrirPerfil}
                                />
                            )}
                            contentContainerStyle={styles.messagesList}
                            keyboardShouldPersistTaps="handled"
                            onContentSizeChange={() =>
                                listaRef.current?.scrollToEnd({
                                    animated: true,
                                })
                            }
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Ionicons
                                        name="chatbubble-ellipses-outline"
                                        size={40}
                                        color={colors.textMuted}
                                    />

                                    <Text
                                        style={[
                                            styles.emptyTitle,
                                            { color: colors.textPrimary },
                                        ]}
                                    >
                                        Nenhuma mensagem ainda
                                    </Text>

                                    <Text
                                        style={[
                                            styles.emptyText,
                                            { color: colors.textSecondary },
                                        ]}
                                    >
                                        Envie uma mensagem para iniciar a conversa.
                                    </Text>
                                </View>
                            }
                        />
                    )}
                </View>

                {/* Campo de envio */}
                <View
                    style={[
                        styles.inputArea,
                        {
                            backgroundColor: colors.bgSecondary,
                            borderTopColor: colors.borderColor,
                        },
                    ]}
                >
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: colors.inputBg,
                                color: colors.textPrimary,
                                borderColor: colors.borderColor,
                            },
                        ]}
                        placeholder="Digite sua mensagem..."
                        placeholderTextColor={colors.textMuted}
                        value={texto}
                        onChangeText={setTexto}
                        multiline
                        maxLength={5000}
                        editable={!enviaMensagem.isPending}
                        returnKeyType="default"
                    />

                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            {
                                backgroundColor:
                                    texto.trim() && !enviaMensagem.isPending
                                        ? colors.accent
                                        : colors.accentDisabled,
                            },
                        ]}
                        onPress={enviar}
                        disabled={
                            !texto.trim() || enviaMensagem.isPending
                        }
                        accessibilityLabel="Enviar mensagem"
                    >
                        {enviaMensagem.isPending ? (
                            <ActivityIndicator color={colors.accentText} />
                        ) : (
                            <Ionicons
                                name="send"
                                size={20}
                                color={colors.accentText}
                            />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Menu de opções */}
                <Modal
                    visible={menuAberto}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setMenuAberto(false)}
                >
                    <TouchableOpacity
                        style={styles.menuOverlay}
                        activeOpacity={1}
                        onPress={() => setMenuAberto(false)}
                    >
                        <View
                            style={[
                                styles.menuCard,
                                {
                                    backgroundColor: colors.cardBg,
                                    borderColor: colors.borderColor,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.menuTitle,
                                    { color: colors.textPrimary },
                                ]}
                            >
                                Opções da conversa
                            </Text>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    setMenuAberto(false);
                                    setDetalhesAbertos(true);
                                }}
                            >
                                <Ionicons
                                    name="people-outline"
                                    size={20}
                                    color={colors.textPrimary}
                                />
                                <Text
                                    style={[
                                        styles.menuItemText,
                                        { color: colors.textPrimary },
                                    ]}
                                >
                                    Detalhes
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    setMenuAberto(false);
                                    setDetalhesAbertos(true);
                                }}
                            >
                                <Ionicons
                                    name="people-outline"
                                    size={20}
                                    color={colors.textPrimary}
                                />
                                <Text
                                    style={[
                                        styles.menuItemText,
                                        { color: colors.textPrimary },
                                    ]}
                                >
                                    Detalhes
                                </Text>
                            </TouchableOpacity>

                            {isAdmin && conversa?.isGrupo && (
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={editar}
                                >
                                    <Ionicons
                                        name="lock-closed-outline"
                                        size={20}
                                        color={colors.textPrimary}
                                    />
                                    <Text
                                        style={[
                                            styles.menuItemText,
                                            { color: colors.textPrimary },
                                        ]}
                                    >
                                        {conversa.isPublico
                                            ? "Tornar privado"
                                            : "Tornar público"}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {conversa?.isPublico && (
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={compartilharGrupo}
                                >
                                    <Ionicons
                                        name="share-outline"
                                        size={20}
                                        color={colors.textPrimary}
                                    />
                                    <Text
                                        style={[
                                            styles.menuItemText,
                                            { color: colors.textPrimary },
                                        ]}
                                    >
                                        Compartilhar grupo
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={sairDaConversa}
                            >
                                <Ionicons
                                    name="exit-outline"
                                    size={20}
                                    color={colors.error}
                                />
                                <Text
                                    style={[
                                        styles.menuItemText,
                                        { color: colors.error },
                                    ]}
                                >
                                    {qtdParticipantes > 2
                                        ? "Sair do grupo"
                                        : "Remover conversa"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.menuCancel,
                                    { borderTopColor: colors.borderColor },
                                ]}
                                onPress={() => setMenuAberto(false)}
                            >
                                <Text
                                    style={[
                                        styles.menuCancelText,
                                        { color: colors.textSecondary },
                                    ]}
                                >
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Detalhes e participantes */}
                <Modal
                    visible={detalhesAbertos}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setDetalhesAbertos(false)}
                >
                    <View style={styles.detailsOverlay}>
                        <View
                            style={[
                                styles.detailsCard,
                                {
                                    backgroundColor: colors.cardBg,
                                    borderColor: colors.borderColor,
                                },
                            ]}
                        >
                            <View style={styles.detailsHeader}>
                                <Text
                                    style={[
                                        styles.detailsTitle,
                                        { color: colors.textPrimary },
                                    ]}
                                >
                                    Detalhes da conversa
                                </Text>

                                <TouchableOpacity
                                    onPress={() => setDetalhesAbertos(false)}
                                >
                                    <Ionicons
                                        name="close"
                                        size={25}
                                        color={colors.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>

                            <Text
                                style={[
                                    styles.detailsSubtitle,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                {nomeConversa || "Conversa"} ·{" "}
                                {qtdParticipantes} participantes
                            </Text>

                            <ScrollView>
                                {conversa?.participantes?.map(
                                    (participante: UsuarioProps, index: string) => (
                                        <TouchableOpacity
                                            key={participante.id ?? index}
                                            style={styles.participantRow}
                                            onPress={() =>
                                                abrirPerfil(participante.username)
                                            }
                                        >
                                            <Image
                                                source={
                                                    participante.picture
                                                        ? {
                                                            uri: participante.picture,
                                                        }
                                                        : 'require("../../assets/default-avatar.png")'
                                                }
                                                style={[
                                                    styles.detailsAvatar,
                                                    {
                                                        borderColor:
                                                            colors.borderColor,
                                                    },
                                                ]}
                                            />

                                            <View style={styles.participantInfo}>
                                                <Text
                                                    style={[
                                                        styles.participantName,
                                                        {
                                                            color: colors.textPrimary,
                                                        },
                                                    ]}
                                                >
                                                    {participante.nome}
                                                </Text>

                                                {participante.id ===
                                                    usuarioLogado?.id && (
                                                        <Text
                                                            style={[
                                                                styles.youLabel,
                                                                {
                                                                    color: colors.textSecondary,
                                                                },
                                                            ]}
                                                        >
                                                            Você
                                                        </Text>
                                                    )}
                                            </View>
                                        </TouchableOpacity>
                                    )
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const makeStyles = (c: ThemePalette) => StyleSheet.create({
    screen: {
        flex: 1,
    },

    keyboardContainer: {
        flex: 1,
        minHeight: 0,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        gap: 10,
    },

    backButton: {
        width: 36,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },

    chatInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    avatars: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 2,
    },

    participanteAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        borderWidth: 2,
    },

    singleAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
    },

    chatTitleContainer: {
        flex: 1,
        gap: 4,
    },

    chatTitle: {
        fontSize: 16,
        fontWeight: "700",
    },

    participantsText: {
        fontSize: 11,
    },

    optionsButton: {
        width: 36,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },

    messagesArea: {
        flex: 1,
    },

    messagesList: {
        flexGrow: 1,
        paddingHorizontal: 12,
        paddingVertical: 16,
        gap: 12,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    emptyContainer: {
        flex: 1,
        minHeight: 250,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        gap: 10,
    },

    emptyTitle: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },

    emptyText: {
        fontSize: 13,
        textAlign: "center",
        lineHeight: 19,
    },

    inputArea: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
    },

    input: {
        flex: 1,
        minHeight: 46,
        maxHeight: 120,
        borderWidth: 1,
        borderRadius: 23,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        fontSize: 14,
    },

    sendButton: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: "center",
        alignItems: "center",
    },

    menuOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "rgba(0,0,0,0.55)",
    },

    menuCard: {
        width: "100%",
        maxWidth: 380,
        paddingTop: 18,
        borderRadius: 18,
        borderWidth: 1,
        overflow: "hidden",
    },

    menuTitle: {
        fontSize: 17,
        fontWeight: "700",
        paddingHorizontal: 20,
        paddingBottom: 12,
    },

    menuItem: {
        minHeight: 50,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    menuItemText: {
        fontSize: 14,
        fontWeight: "500",
    },

    menuCancel: {
        borderTopWidth: StyleSheet.hairlineWidth,
        marginTop: 8,
        padding: 16,
        alignItems: "center",
    },

    menuCancelText: {
        fontSize: 14,
        fontWeight: "600",
    },

    detailsOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.55)",
    },

    detailsCard: {
        height: "70%",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 20,
    },

    detailsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },

    detailsTitle: {
        fontSize: 20,
        fontWeight: "700",
    },

    detailsSubtitle: {
        fontSize: 13,
        marginBottom: 18,
    },

    participantRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 10,
    },

    detailsAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
    },

    participantInfo: {
        flex: 1,
        gap: 3,
    },

    participantName: {
        fontSize: 14,
        fontWeight: "600",
    },

    youLabel: {
        fontSize: 11,
    },
});