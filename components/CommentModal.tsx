
import { useMemo, useState } from "react";
import {
    View,
    Text,
    Modal,
    FlatList,
    Image,
    Pressable,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    ActivityIndicator,
    StyleSheet,
    useColorScheme,
} from "react-native";

import {
    X,
    MessageCircle,
    Send,
} from "lucide-react-native";

import { useRouter } from "expo-router";
import ComentarioProps from "@/app/interface/ComentarioProps";
import { ComentarioRequest, useComentarioPost } from "@/hooks/postagem/useComentarioPost";
import { formatarTempoRelativo } from "./PostCard";
import { Palette, ThemePalette } from "@/constants/pallete";


interface CommentModalProps {
    comentarios: ComentarioProps[] | undefined;
    idPostagem: string | undefined;
    idUsuario: string | undefined;
    onClose: () => void | undefined;
    visible: boolean | undefined;
}

export function CommentModal({
    comentarios,
    idPostagem,
    idUsuario,
    onClose,
    visible,
}: CommentModalProps) {
    const [comentario, setComentario] = useState("");
    const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
    const styles = useMemo(() => makeStyles(colors), [colors]);

    const { mutate: criarComentario, isPending } =
        useComentarioPost();

    const router = useRouter();

    const fechar = () => {
        Keyboard.dismiss();
        onClose();
    };

    const publicarComentario = () => {
        const texto = comentario.trim();

        if (!texto || !idUsuario || isPending) return;

        const props: ComentarioRequest = {
            conteudo: texto,
            idPostagem: idPostagem ?? "",
            idUsuario,
        };

        criarComentario(props, {
            onSuccess: () => {
                setComentario("");
                Keyboard.dismiss();
            },
        });
    };

    const navegarPerfil = (username: string) => {
        fechar();
        router.push(`/user/${username}` as any);
    };

    const renderComentario = ({
        item,
    }: {
        item: ComentarioProps;
    }) => {
        const inicial =
            item.usuario.nome?.charAt(0).toUpperCase() || "U";

        return (
            <View style={styles.commentItem}>
                <Pressable
                    style={styles.avatar}
                    onPress={() => navegarPerfil(item.usuario.username)}
                >
                    {item.usuario.picture ? (
                        <Image
                            source={{ uri: item.usuario.picture }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <Text style={styles.avatarLetter}>
                            {inicial}
                        </Text>
                    )}
                </Pressable>

                <View style={styles.commentBody}>
                    <Pressable
                        onPress={() => navegarPerfil(item.usuario.username)}
                    >
                        <Text style={styles.username}>
                            {item.usuario.nome}
                        </Text>
                    </Pressable>

                    <Text style={styles.commentText}>
                        {item.conteudo}
                    </Text>

                    <Text style={styles.commentTime}>
                        {formatarTempoRelativo(item.createdAt)}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <Modal
            visible={visible ?? false}
            transparent
            animationType="slide"
            onRequestClose={fechar}
        >
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
            >
                <Pressable
                    style={styles.backdrop}
                    onPress={fechar}
                />

                <View style={styles.container}>
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <View style={styles.headerTitle}>
                            <Text style={styles.title}>
                                Comentários
                            </Text>

                            <Text style={styles.count}>
                                {comentarios?.length ?? 0}
                            </Text>
                        </View>

                        <Pressable
                            onPress={fechar}
                            style={styles.closeButton}
                            hitSlop={10}
                        >
                            <X
                                size={20}
                                color={colors.textPrimary}
                            />
                        </Pressable>
                    </View>

                    <FlatList
                        data={comentarios ?? []}
                        keyExtractor={(item) => item.id}
                        renderItem={renderComentario}
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <MessageCircle
                                    size={32}
                                    color={colors.textMuted}
                                />

                                <Text style={styles.emptyTitle}>
                                    Nenhum comentário ainda
                                </Text>
                            </View>
                        }
                    />

                    <View style={styles.footer}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={comentario}
                                onChangeText={setComentario}
                                placeholder="Adicione um comentário..."
                                placeholderTextColor={colors.textMuted}
                                style={styles.input}
                                multiline
                                maxLength={500}
                                editable={!isPending && !!idUsuario}
                            />

                            <Pressable
                                onPress={publicarComentario}
                                disabled={
                                    !comentario.trim() ||
                                    !idUsuario ||
                                    isPending
                                }
                                style={[
                                    styles.sendButton,
                                    (!comentario.trim() ||
                                        !idUsuario ||
                                        isPending) &&
                                    styles.sendButtonDisabled,
                                ]}
                            >
                                {isPending ? (
                                    <ActivityIndicator
                                        color={colors.accentText}
                                    />
                                ) : (
                                    <Send
                                        size={18}
                                        color={colors.accentText}
                                    />
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const makeStyles = (colors: ThemePalette) =>
    StyleSheet.create({
        keyboardContainer: {
            flex: 1,
            minHeight: 0,
            justifyContent: "flex-end",
        },

        backdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.65)",
        },

        footer: {
            flexShrink: 0,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.bgSecondary,
            borderTopWidth: 1,
            borderTopColor: colors.borderColor,
        },

        closeButton: {
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: colors.bgTertiary,
            justifyContent: "center",
            alignItems: "center",
        },

        container: {
            width: "100%",
            height: "82%",
            flexShrink: 1,
            backgroundColor: colors.bgPrimary,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
        },

        header: {
            height: 58,
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: colors.borderColor,
        },

        title: {
            fontSize: 17,
            fontWeight: "700",
            color: colors.textPrimary,
        },

        commentText: {
            fontSize: 14,
            lineHeight: 21,
            color: colors.textPrimary,
        },

        commentTime: {
            fontSize: 11,
            color: colors.textMuted,
            marginTop: 8,
        },

        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBg,
            borderWidth: 1,
            borderColor: colors.borderColor,
            borderRadius: 22,
            paddingLeft: 16,
            paddingRight: 5,
            minHeight: 46,
        },

        sendButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.accent,
            justifyContent: "center",
            alignItems: "center",
        },

        sendButtonDisabled: {
            backgroundColor: colors.accentDisabled,
            opacity: 0.55,
        },


        overlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.65)",
            justifyContent: "flex-end",
        },

        handle: {
            width: 38,
            height: 4,
            borderRadius: 4,
            backgroundColor: "#374151",
            alignSelf: "center",
            marginTop: 10,
            marginBottom: 8,
        },

        headerTitle: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },

        count: {
            fontSize: 12,
            fontWeight: "600",
            color: colors.accentText,
            backgroundColor: colors.accent,
            paddingHorizontal: 9,
            paddingVertical: 3,
            borderRadius: 20,
        },


        list: {
            flex: 1,
            minHeight: 0,
        },

        listContent: {
            paddingHorizontal: 20,
            paddingVertical: 20,
            flexGrow: 1,
        },

        commentItem: {
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 25,
        },

        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#252d3c",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
        },

        avatarImage: {
            width: "100%",
            height: "100%",
            borderRadius: 20,
        },

        avatarLetter: {
            fontSize: 17,
            fontWeight: "700",
            color: "#f9fafb",
        },

        commentBody: {
            flex: 1,
            paddingTop: 2,
        },

        username: {
            fontSize: 14,
            fontWeight: "700",
            color: "#f3f4f6",
            marginBottom: 5,
        },


        emptyList: {
            justifyContent: "center",
        },

        emptyContainer: {
            alignItems: "center",
            paddingHorizontal: 25,
            paddingBottom: 45,
        },

        emptyIcon: {
            width: 74,
            height: 74,
            borderRadius: 37,
            backgroundColor: "#171d28",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 18,
        },

        emptyTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: "#f3f4f6",
            marginBottom: 8,
        },

        emptyDescription: {
            fontSize: 13,
            lineHeight: 20,
            color: "#9ca3af",
            textAlign: "center",
        },

        input: {
            flex: 1,
            color: "#f9fafb",
            fontSize: 14,
            paddingVertical: 9,
            maxHeight: 110,
        },
        characterCount: {
            fontSize: 10,
            color: "#6b7280",
            textAlign: "right",
            marginTop: 5,
            marginRight: 8,
        },
    });