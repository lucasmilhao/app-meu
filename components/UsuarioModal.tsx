
import { useState, useEffect, useMemo } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Modal as RNModal,
    ActivityIndicator,
    StyleSheet,
    Alert,
    useColorScheme,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UsuarioProps } from "@/app/interface/UsuarioProps";
import { useUsuarioEdit } from "@/hooks/usuario/useUsuarioEdit";
import { Palette, ThemePalette } from "@/constants/pallete";

interface ModalProps {
    visible: boolean;
    onClose(): void;
    usuarioLogado?: UsuarioProps;
}

export function UsuarioModal({
    visible,
    onClose,
    usuarioLogado,
}: ModalProps) {

    const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
    const styles = useMemo(() => makeStyles(colors), [colors]);

    const [file, setFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [nome, setNome] = useState(usuarioLogado?.nome ?? "");

    const {
        mutate: edit,
        isError,
        isPending,
        error,
    } = useUsuarioEdit();

    useEffect(() => {
        setNome(usuarioLogado?.nome ?? "");
        setFile(null);
    }, [usuarioLogado, visible]);

    const avatarSrc = file?.uri
        ? { uri: file.uri }
        : usuarioLogado?.picture
            ? { uri: usuarioLogado.picture }
            : 'require("../../assets/images/default-avatar.png")';

    const handleChange = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(
                "Permissão necessária",
                "Precisamos de acesso à galeria para selecionar uma imagem."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setFile(result.assets[0]);
        }
    };

    const submit = () => {
        if (!nome.trim()) {
            Alert.alert("Atenção", "O nome não pode ficar vazio.");
            return;
        }

        const formData = new FormData();

        formData.append("nome", nome.trim());

        if (file) {
            const extension = file.uri.split(".").pop() || "jpg";

            formData.append("file", {
                uri: file.uri,
                name: `profile.${extension}`,
                type: file.mimeType || "image/jpeg",
            } as any);
        }

        edit(
            {
                id: usuarioLogado?.id ?? "",
                formData,
            },
            {
                onSuccess: () => {
                    onClose();
                },
                onError: (err: any) => {
                    console.log(err.response?.data);
                },
            }
        );
    };

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.container,
                        {
                            backgroundColor: colors.cardBg,
                            borderColor: colors.borderColor,
                        },
                    ]}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text
                                style={[
                                    styles.title,
                                    { color: colors.textPrimary },
                                ]}
                            >
                                Editar perfil
                            </Text>

                            <Text
                                style={[
                                    styles.subtitle,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Atualize seu nome e foto de perfil.
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Text
                                style={[
                                    styles.closeText,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                ×
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Avatar */}
                    <View style={styles.avatarContainer}>
                        <Image
                            source={avatarSrc}
                            style={[
                                styles.avatar,
                                { borderColor: colors.borderColor },
                            ]}
                        />

                        <TouchableOpacity
                            style={[
                                styles.imageButton,
                                { backgroundColor: colors.bgTertiary },
                            ]}
                            onPress={handleChange}
                        >
                            <Text
                                style={[
                                    styles.imageButtonText,
                                    { color: colors.accent },
                                ]}
                            >
                                Trocar imagem
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Error */}
                    {isError && (
                        <Text
                            style={[
                                styles.errorText,
                                { color: colors.error },
                            ]}
                        >
                            {error?.message || "Erro ao atualizar perfil."}
                        </Text>
                    )}

                    {/* Name */}
                    <View style={styles.field}>
                        <Text
                            style={[
                                styles.label,
                                { color: colors.textPrimary },
                            ]}
                        >
                            Nome
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.inputBg,
                                    color: colors.textPrimary,
                                    borderColor: colors.borderColor,
                                },
                            ]}
                            value={nome}
                            onChangeText={setNome}
                            placeholder="Digite seu nome"
                            placeholderTextColor={colors.textMuted}
                            autoCapitalize="words"
                        />
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[
                                styles.cancelButton,
                                { borderColor: colors.borderColor },
                            ]}
                            onPress={onClose}
                            disabled={isPending}
                        >
                            <Text
                                style={[
                                    styles.cancelText,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                {
                                    backgroundColor: isPending
                                        ? colors.accentDisabled
                                        : colors.accent,
                                },
                            ]}
                            onPress={submit}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <ActivityIndicator
                                    color={colors.accentText}
                                />
                            ) : (
                                <Text
                                    style={[
                                        styles.saveText,
                                        { color: colors.accentText },
                                    ]}
                                >
                                    Salvar alterações
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </RNModal>
    );
}

const makeStyles = (c: ThemePalette) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.65)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    container: {
        width: "100%",
        maxWidth: 420,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 28,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
    },

    subtitle: {
        fontSize: 13,
        marginTop: 5,
    },

    closeButton: {
        paddingHorizontal: 5,
    },

    closeText: {
        fontSize: 30,
        lineHeight: 30,
    },

    avatarContainer: {
        alignItems: "center",
        marginBottom: 28,
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 2,
    },

    imageButton: {
        marginTop: 12,
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 8,
    },

    imageButtonText: {
        fontSize: 13,
        fontWeight: "600",
    },

    errorText: {
        fontSize: 12,
        marginBottom: 12,
        textAlign: "center",
    },

    field: {
        marginBottom: 28,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 9,
    },

    input: {
        height: 48,
        borderRadius: 9,
        borderWidth: 1,
        paddingHorizontal: 14,
        fontSize: 14,
    },

    actions: {
        flexDirection: "row",
        gap: 12,
    },

    cancelButton: {
        flex: 1,
        height: 48,
        borderRadius: 9,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    cancelText: {
        fontSize: 13,
        fontWeight: "600",
    },

    saveButton: {
        flex: 1.5,
        height: 48,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
    },

    saveText: {
        fontSize: 13,
        fontWeight: "700",
    },
});
