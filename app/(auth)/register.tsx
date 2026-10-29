import Ionicons from "@expo/vector-icons/Ionicons";
import { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Palette, type ThemePalette } from "@/constants/pallete";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useUsuarioLogin } from "@/hooks/usuario/useUsuarioLogin";
import { useUsuarioCreate } from "@/hooks/usuario/useUsuarioCreate";

const APP_NAME = "Cubing2gether";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mensagemDeErro(error: unknown) {
  if (isAxiosError(error)) {
    if (!error.response) {
      return "Não foi possível conectar ao servidor. Verifique sua conexão.";
    }
    if ([400, 401, 403, 404].includes(error.response.status)) {
      return "E-mail ou senha incorretos.";
    }
  }
  return "Algo deu errado. Tente novamente em instantes.";
}

export default function Register() {
  const router = useRouter();
  const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const register = useUsuarioCreate();

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [focado, setFocado] = useState<"email" | "senha" | "nome" | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const senhaRef = useRef<TextInput>(null);

  // As rotas /register e /recuperar-senha ainda não existem no app;
  // o cast evita erro do typedRoutes até você criá-las.
  const irPara = (rota: string) => router.push(rota as never);

  const entrar = () => {
    if (register.isPending) return;

    if (!EMAIL_REGEX.test(email.trim())) {
      setErro("Digite um e-mail válido.");
      return;
    }
    if (!senha) {
      setErro("Digite sua senha.");
      return;
    }

    setErro(null);
    register.mutate(
      { email: email.trim(), nome, senha },
      {
        onSuccess: () => router.replace("/(tabs)"),
        onError: (e) => setErro(mensagemDeErro(e)),
      }
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.titulo}>{APP_NAME}</Text>
            <Text style={styles.subtitulo}>Entre para continuar</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>E-mail</Text>
            <View style={[styles.campo, focado === "email" && styles.campoFocado]}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="voce@email.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onFocus={() => setFocado("email")}
                onBlur={() => setFocado(null)}
                onSubmitEditing={() => senhaRef.current?.focus()}
              />
            </View>


            <Text style={styles.label}>Nome</Text>
            <View style={[styles.campo, focado === "nome" && styles.campoFocado]}>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Joao Lucas"
                placeholderTextColor={colors.textMuted}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onFocus={() => setFocado("nome")}
                onBlur={() => setFocado(null)}
                onSubmitEditing={() => senhaRef.current?.focus()}
              />
            </View>

            <Text style={[styles.label, styles.labelSenha]}>Senha</Text>
            <View style={[styles.campo, focado === "senha" && styles.campoFocado]}>
              <TextInput
                ref={senhaRef}
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                placeholder="Sua senha"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onFocus={() => setFocado("senha")}
                onBlur={() => setFocado(null)}
                onSubmitEditing={entrar}
              />
              <Pressable
                onPress={() => setMostrarSenha((v) => !v)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                <Ionicons
                  name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            <Pressable onPress={() => irPara("/recuperar-senha")} style={styles.esqueci}>
              <Text style={styles.link}>Esqueci minha senha</Text>
            </Pressable>

            {erro ? <Text style={styles.erro}>{erro}</Text> : null}

            <Pressable
              onPress={entrar}
              disabled={register.isPending}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.botao,
                pressed && styles.botaoPressionado,
                register.isPending && styles.botaoDesabilitado,
              ]}
            >
              {register.isPending ? (
                <ActivityIndicator color={colors.accentText} />
              ) : (
                <Text style={styles.botaoTexto}>Entrar</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.rodape}>
            <Text style={styles.rodapeTexto}>Não tem conta?</Text>
            <Pressable onPress={() => irPara("/login")} hitSlop={8}>
              <Text style={styles.link}>Fazer login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (c: ThemePalette) =>
  StyleSheet.create({
    flex: { flex: 1 },
    safe: {
      flex: 1,
      backgroundColor: c.bgPrimary,
    },
    content: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      gap: 24,
    },
    header: {
      width: "100%",
      maxWidth: 420,
      gap: 4,
    },
    titulo: {
      color: c.textPrimary,
      fontSize: 32,
      fontWeight: "800",
    },
    subtitulo: {
      color: c.textSecondary,
      fontSize: 16,
    },
    card: {
      width: "100%",
      maxWidth: 420,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.borderColor,
      backgroundColor: c.cardBg,
      shadowColor: "#000",
      shadowOpacity: c.shadowOpacity,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    label: {
      color: c.textPrimary,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 6,
    },
    labelSenha: {
      marginTop: 16,
    },
    campo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      height: 50,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.borderColor,
      backgroundColor: c.inputBg,
    },
    campoFocado: {
      borderColor: c.accent,
    },
    input: {
      flex: 1,
      color: c.textPrimary,
      fontSize: 16,
    },
    esqueci: {
      alignSelf: "flex-end",
      marginTop: 12,
    },
    link: {
      color: c.accent,
      fontSize: 14,
      fontWeight: "600",
    },
    erro: {
      color: c.error,
      fontSize: 14,
      marginTop: 12,
    },
    botao: {
      height: 50,
      marginTop: 20,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.accent,
    },
    botaoPressionado: {
      backgroundColor: c.accentHover,
    },
    botaoDesabilitado: {
      backgroundColor: c.accentDisabled,
    },
    botaoTexto: {
      color: c.accentText,
      fontSize: 16,
      fontWeight: "700",
    },
    rodape: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    rodapeTexto: {
      color: c.textSecondary,
      fontSize: 14,
    },
  });