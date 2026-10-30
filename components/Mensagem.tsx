import MensagemResponse from "@/app/interface/MensagemResponse";
import { Palette, ThemePalette } from "@/constants/pallete";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
    StyleSheet,
    useColorScheme,
    Pressable,
} from "react-native";


interface MensagemProps extends MensagemResponse {
    isOwnMessage?: boolean;
    onPressProfile?: (username?: string) => void;
}

const extrairRoomId = (texto: string): string | null => {
    const match = texto.match(
        /https:\/\/cubing2gether-2aen\.onrender\.com\/video\/([a-f0-9-]{36})/i
    );

    return match?.[1] ?? null;
};

export function Mensagem(props: MensagemProps) {


    const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
    const styles = useMemo(() => makeStyles(colors), [colors]);


    const user = props.sender;
    const isOwnMessage = Boolean(props.isOwnMessage);
    const router = useRouter();

    const roomId = extrairRoomId(props.texto);

    const entrarNaChamada = () => {
        if (!roomId) return;

        router.push({
            pathname: "/(screens)/video-call",
            params: { roomId },
        });
    };

    const hora = props.mandado
        ? new Date(props.mandado).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";

    const textColor = isOwnMessage
        ? colors.accentText
        : colors.textPrimary;

    const linksColor = isOwnMessage
        ? colors.accentText
        : colors.accent;

    const renderTextoComLinks = (texto: string) => {
        const regex = /(https?:\/\/[^\s]+)/g;
        const partes = texto.split(regex);

        return partes.map((parte, index) => {
            if (/^https?:\/\//i.test(parte)) {
                const url = parte.replace(/[.,!?;:)]+$/, "");
                const pontuacao = parte.slice(url.length);

                return (
                    <Text
                        key={index}
                        style={[
                            styles.link,
                            { color: linksColor },
                        ]}
                        onPress={() => Linking.openURL(url)}
                    >
                        {url}
                        {pontuacao}
                    </Text>
                );
            }

            return (
                <Text key={index} style={{ color: textColor }}>
                    {parte}
                </Text>
            );
        });
    };

    return (
        <View
            style={[
                styles.messageContainer,
                {
                    backgroundColor: isOwnMessage
                        ? colors.accent
                        : colors.bgTertiary,
                    borderColor: isOwnMessage
                        ? "transparent"
                        : colors.borderColor,
                },
                isOwnMessage
                    ? styles.ownMessage
                    : styles.receivedMessage,
            ]}
        >
            {/* Informações do remetente */}
            <TouchableOpacity
                style={styles.userHeader}
                activeOpacity={0.75}
                onPress={() => props.onPressProfile?.(user?.username)}
            >
                <Image
                    source={
                        user?.picture
                            ? { uri: user.picture }
                            : 'require("../../assets/default-avatar.png")'
                    }
                    style={[
                        styles.avatar,
                        { borderColor: colors.borderColor },
                    ]}
                />

                <Text
                    numberOfLines={1}
                    style={[
                        styles.userName,
                        { color: textColor },
                    ]}
                >
                    {user?.nome || "Usuário"}
                </Text>
            </TouchableOpacity>

            {/* Texto da mensagem */}
            <Text style={styles.messageText}>
                {renderTextoComLinks(props.texto ?? "")}
            </Text>

            {roomId && (
                <Pressable
                    onPress={entrarNaChamada}
                    style={{
                        backgroundColor: colors.accent,
                        padding: 12,
                        borderRadius: 12,
                        alignItems: "center",
                        marginTop: 8,
                    }}
                >
                    <Text
                        style={{
                            color: colors.accentText,
                            fontWeight: "700",
                        }}
                    >
                        Entrar na chamada
                    </Text>
                </Pressable>
            )}

            {/* Horário e status */}
            <View style={styles.footer}>
                <Text
                    style={[
                        styles.time,
                        {
                            color: textColor,
                            opacity: isOwnMessage ? 0.75 : 0.8,
                        },
                    ]}
                >
                    {hora}
                </Text>

                {isOwnMessage && (
                    <View
                        accessibilityLabel={
                            props.isVisto
                                ? "Mensagem vista"
                                : "Mensagem não lida"
                        }
                    >
                        <CheckIcon
                            visto={Boolean(props.isVisto)}
                            color={colors.accentText}
                            styles={styles}
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

function CheckIcon({
    visto,
    color,
    styles
}: {
    visto: boolean;
    color: string;
    styles: any
}) {
    return (
        <View style={styles.checkContainer}>
            <Text style={[styles.check, { color }]}>✓</Text>

            {visto && (
                <Text
                    style={[
                        styles.check,
                        styles.secondCheck,
                        { color },
                    ]}
                >
                    ✓
                </Text>
            )}
        </View>
    );
}

const makeStyles = (c: ThemePalette) => StyleSheet.create({
    messageContainer: {
        alignSelf: "flex-start",
        maxWidth: "85%",
        minWidth: "25%",
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 7,
        marginVertical: 5,
    },

    ownMessage: {
        alignSelf: "flex-end",
        borderBottomRightRadius: 5,
    },

    receivedMessage: {
        alignSelf: "flex-start",
        borderBottomLeftRadius: 5,
    },

    userHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        marginBottom: 8,
    },

    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
    },

    userName: {
        fontSize: 13,
        fontWeight: "600",
        flexShrink: 1,
    },

    messageText: {
        fontSize: 14,
        lineHeight: 21,
        flexWrap: "wrap",
    },

    link: {
        textDecorationLine: "underline",
    },

    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 4,
        marginTop: 5,
        minHeight: 16,
    },

    time: {
        fontSize: 10,
    },

    checkContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 2,
    },

    check: {
        fontSize: 14,
        fontWeight: "700",
        lineHeight: 16,
    },

    secondCheck: {
        marginLeft: -7,
    },
});