import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Camera, CameraOff, FlipHorizontal2, Mic, MicOff, PhoneOff } from "lucide-react-native";
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from "react-native-webrtc";

import { usePartidaUsuarioData } from "../../hooks/partidas/usePartidaUsuarioData";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { useSolveMutate } from "../../hooks/solves/useSolveMutate";
import { usePartidaUsuarioEdit } from "../../hooks/partidas/usePartidaUsuarioEdit";
import { socket } from "@/components/socket";
import { SolveRequest } from "../interface/SolveRequest";
import { Palette } from "@/constants/pallete";
import useScramble from "@/hooks/scramble/useScramble";

type DescriptionPayload = { offer?: any; answer?: any };
type IcePayload = { candidate: any };

function formatTime(ms: number) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  const formatted = `${String(sec).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  return min ? `${min}:${formatted}` : formatted;
}

export default function VideoCall() {
  const params = useLocalSearchParams<{ roomId: string }>();
  const roomId = Array.isArray(params.roomId) ? params.roomId[0] : params.roomId;
  const router = useRouter();
  const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { data: usuarioLogado } = useUsuarioLogado();
  const userId = usuarioLogado?.id;
  const { data: dadosPartida } = usePartidaUsuarioData(roomId);
  const { refetch: refetchScramble } = useScramble("3x3x3");
  const solveMutation = useSolveMutate();
  const partidaUsuarioMutation = usePartidaUsuarioEdit();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [mainIsLocal, setMainIsLocal] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [frontCamera, setFrontCamera] = useState(true);
  const [scramble, setScramble] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [opponentElapsed, setOpponentElapsed] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [opponentRunning, setOpponentRunning] = useState(false);
  const [waitingOpponent, setWaitingOpponent] = useState(false);
  const [startingCall, setStartingCall] = useState(true);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localRef = useRef<MediaStream | null>(null);
  const remoteRef = useRef<MediaStream | null>(null);
  const pendingIceRef = useRef<any[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const opponentTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);
  const opponentStartedAtRef = useRef(0);
  const runningRef = useRef(false);
  const readyRef = useRef(false);
  const waitingRef = useRef(false);
  const scrambleRef = useRef("");
  const isCreatorRef = useRef(false);
  const scrambleRequestedRef = useRef(false);
  const mountedRef = useRef(true);

  const opponentName = useMemo(() => {
    if (!Array.isArray(dadosPartida)) return "Oponente";
    return dadosPartida.find((p) => p.usuario?.id !== userId)?.usuario?.nome ?? "Oponente";
  }, [dadosPartida, userId]);

  const stopClocks = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (opponentTimerRef.current) clearInterval(opponentTimerRef.current);
    timerRef.current = null;
    opponentTimerRef.current = null;
  }, []);

  const createScramble = useCallback(async () => {
    // Apenas quem criou a sala propõe o próximo scramble.
    if (!isCreatorRef.current || !roomId || scrambleRequestedRef.current) return;
    scrambleRequestedRef.current = true;
    try {
      const response = await refetchScramble();
      const next = response.data?.scramble;
      if (!next || !mountedRef.current) {
        scrambleRequestedRef.current = false;
        return;
      }
      scrambleRef.current = next;
      setScramble(next);
      socket.emit("scramble-created", { roomId, scramble: next });
    } catch (error) {
      scrambleRequestedRef.current = false;
      console.warn("Erro ao gerar scramble", error);
    }
  }, [refetchScramble, roomId]);

  const flushIce = useCallback(async (pc: RTCPeerConnection) => {
    const pending = pendingIceRef.current.splice(0);
    for (const candidate of pending) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.warn("ICE pendente falhou", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!roomId || !userId) return;
    mountedRef.current = true;
    let cancelled = false;
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Adicione um servidor TURN autenticado para uso em produção.
      ],
    });
    pcRef.current = pc;
    pendingIceRef.current = [];

    pc.addEventListener("icecandidate", (event: any) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          roomId,
          candidate: event.candidate.toJSON?.() ?? event.candidate,
        });
      }
    });
    pc.addEventListener("track", (event: any) => {
      if (cancelled) return;
      const incoming = event.streams?.[0] ?? new MediaStream([event.track]);
      remoteRef.current = incoming;
      setRemoteStream(incoming);
      setRemoteConnected(true);
    });
    pc.addEventListener("connectionstatechange", () => {
      if (cancelled) return;
      if (pc.connectionState === "failed" || pc.connectionState === "closed") {
        setRemoteConnected(false);
      }
    });

    const onCreated = () => {
      isCreatorRef.current = true;
      void createScramble();
    };
    const onJoined = async () => {
      // Corresponde ao evento "joined" do frontend web.
      socket.emit("request-scramble", { roomId });
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer: pc.localDescription });
      } catch (error) {
        console.warn("Falha ao criar offer", error);
      }
    };
    const onOffer = async ({ offer }: DescriptionPayload) => {
      if (!offer) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        await flushIce(pc);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer: pc.localDescription });
      } catch (error) {
        console.warn("Falha ao responder offer", error);
      }
    };
    const onAnswer = async ({ answer }: DescriptionPayload) => {
      if (!answer) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        await flushIce(pc);
      } catch (error) {
        console.warn("Falha ao aceitar answer", error);
      }
    };
    const onIce = async ({ candidate }: IcePayload) => {
      if (!candidate) return;
      if (!pc.remoteDescription) {
        pendingIceRef.current.push(candidate);
        return;
      }
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.warn("Falha ao adicionar ICE", error);
      }
    };
    const onScramble = ({ scramble: next }: { scramble: string }) => {
      if (next) {
        scrambleRequestedRef.current = true;
        scrambleRef.current = next;
        setScramble(next);
      }
    };
    const onOpponentReady = ({ pronto }: { pronto: boolean }) => {
      setOpponentReady(pronto);
    };
    const onOpponentStart = ({ startTime }: { startTime?: number }) => {
      if (opponentTimerRef.current) clearInterval(opponentTimerRef.current);
      // O relógio local evita depender da sincronização dos relógios dos aparelhos.
      opponentStartedAtRef.current = Date.now();
      setOpponentElapsed(0);
      setOpponentReady(false);
      setOpponentRunning(true);
      opponentTimerRef.current = setInterval(() => {
        setOpponentElapsed(Date.now() - opponentStartedAtRef.current);
      }, 50);
    };
    const onOpponentStop = ({ tempo }: { tempo: number }) => {
      if (opponentTimerRef.current) clearInterval(opponentTimerRef.current);
      opponentTimerRef.current = null;
      setOpponentRunning(false);
      setOpponentReady(false);
      setOpponentElapsed(tempo);
    };
    const onRoundComplete = () => {
      stopClocks();
      runningRef.current = false;
      readyRef.current = false;
      waitingRef.current = false;
      scrambleRef.current = "";
      scrambleRequestedRef.current = false;
      setIsRunning(false);
      setIsReady(false);
      setWaitingOpponent(false);
      setElapsed(0);
      setOpponentElapsed(0);
      setOpponentReady(false);
      setOpponentRunning(false);
      setScramble("");
      if (isCreatorRef.current) void createScramble();
      else socket.emit("request-scramble", { roomId });
    };
    const onDisconnected = () => {
      setRemoteConnected(false);
      setRemoteStream(null);
      remoteRef.current = null;
    };

    socket.on("created", onCreated);
    socket.on("joined", onJoined);
    socket.on("offer", onOffer);
    socket.on("answer", onAnswer);
    socket.on("ice-candidate", onIce);
    socket.on("scramble", onScramble);
    socket.on("timer-pronto", onOpponentReady);
    socket.on("timer-start", onOpponentStart);
    socket.on("timer-stop", onOpponentStop);
    socket.on("round-complete", onRoundComplete);
    socket.on("user-disconnected", onDisconnected);

    const init = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: { facingMode: "user", width: 640, height: 480, frameRate: 24 },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        localRef.current = stream;
        setLocalStream(stream);
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        socket.connect();
        socket.emit("join-room", { roomId, userId });
      } catch (error) {
        console.warn("Não foi possível acessar câmera/microfone", error);
        Alert.alert("Câmera e microfone", "Verifique as permissões para participar da chamada.");
      } finally {
        if (!cancelled) setStartingCall(false);
      }
    };
    void init();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      socket.emit("leave-room", { roomId, userId });
      socket.off("created", onCreated);
      socket.off("joined", onJoined);
      socket.off("offer", onOffer);
      socket.off("answer", onAnswer);
      socket.off("ice-candidate", onIce);
      socket.off("scramble", onScramble);
      socket.off("timer-pronto", onOpponentReady);
      socket.off("timer-start", onOpponentStart);
      socket.off("timer-stop", onOpponentStop);
      socket.off("round-complete", onRoundComplete);
      socket.off("user-disconnected", onDisconnected);
      stopClocks();
      pc.close();
      pcRef.current = null;
      localRef.current?.getTracks().forEach((track) => track.stop());
      localRef.current = null;
      remoteRef.current = null;
      pendingIceRef.current = [];
      isCreatorRef.current = false;
      scrambleRequestedRef.current = false;
    };
  }, [roomId, userId, createScramble, flushIce, stopClocks]);

  const startTimer = () => {
    if (runningRef.current || waitingRef.current || !scrambleRef.current) return;
    readyRef.current = false;
    setIsReady(false);
    runningRef.current = true;
    startedAtRef.current = Date.now();
    setElapsed(0);
    setIsRunning(true);
    socket.emit("timer-pronto", { roomId, userId, pronto: false });
    socket.emit("timer-start", { roomId, userId });
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - startedAtRef.current);
    }, 30);
  };

  const stopTimer = () => {
    if (!runningRef.current || !roomId || !userId) return;
    const finalTime = Date.now() - startedAtRef.current;
    runningRef.current = false;
    waitingRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setElapsed(finalTime);
    setIsRunning(false);
    setIsReady(false);
    setWaitingOpponent(true);

    socket.emit("solve-done", { roomId, userId });
    socket.emit("timer-stop", { roomId, userId, tempo: finalTime });

    const request: SolveRequest = {
      tempo: finalTime,
      scramble: scrambleRef.current,
      penalty: null,
      userId,
      partidaId: roomId,
    };
    solveMutation.mutate(request, {
      onSuccess: () => {
        partidaUsuarioMutation.mutate({ idUsuario: userId, idPartida: roomId });
      },
      onError: () => Alert.alert("Erro", "Seu tempo não foi salvo. Verifique a conexão."),
    });
  };

  const onTimerPressIn = () => {
    if (runningRef.current) {
      stopTimer();
      return;
    }
    if (waitingRef.current || !scrambleRef.current) return;
    readyRef.current = true;
    setIsReady(true);
    socket.emit("timer-pronto", { roomId, userId, pronto: true });
  };
  const onTimerPressOut = () => {
    if (readyRef.current) startTimer();
  };

  const toggleMicrophone = () => {
    const track = localRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicEnabled(track.enabled);
  };
  const toggleCamera = () => {
    const track = localRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCameraEnabled(track.enabled);
  };
  const flipCamera = async () => {
    const track = localRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      await track.applyConstraints({ facingMode: frontCamera ? "environment" : "user" });
      setFrontCamera((previous) => !previous);
    } catch (error) {
      Alert.alert("Câmera", "Não foi possível alternar a câmera neste aparelho.");
    }
  };
  const confirmLeave = () => {
    Alert.alert("Sair da chamada?", "Sua conexão com a partida será encerrada.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => router.back() },
    ]);
  };

  const mainStream = mainIsLocal ? localStream : remoteStream;
  const miniStream = mainIsLocal ? remoteStream : localStream;
  const mainLabel = mainIsLocal ? "Você" : opponentName;
  const miniLabel = mainIsLocal ? opponentName : "Você";
  const timerColor = isReady ? colors.success : isRunning ? colors.accent : colors.textPrimary;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.headingGroup}>
          <View style={styles.liveDot} />
          <Text style={styles.heading}>Partida ao vivo</Text>
          <Text style={styles.puzzleLabel}>3x3x3</Text>
        </View>
        <Pressable onPress={confirmLeave} style={styles.leaveTop} hitSlop={10}>
          <PhoneOff size={17} color={colors.error} />
        </Pressable>
      </View>

      <View style={styles.scrambleCard}>
        <Text style={styles.overline}>EMBARALHAMENTO DA RODADA</Text>
        <Text style={styles.scrambleText}>{scramble || "Aguardando scramble compartilhado..."}</Text>
      </View>

      <View style={styles.videoStage}>
        {mainStream ? (
          <RTCView
            key={mainStream.toURL()}
            streamURL={mainStream.toURL()}
            style={styles.video}
            objectFit="cover"
            mirror={mainIsLocal && frontCamera}
            zOrder={0}
          />
        ) : (
          <View style={styles.videoPlaceholder}>
            {startingCall && <ActivityIndicator color="#ffffff" />}
            <Text style={styles.placeholderText}>
              {startingCall ? "Preparando câmera..." : "Aguardando oponente..."}
            </Text>
          </View>
        )}
        <View style={styles.mainVideoLabel}>
          <Text style={styles.videoLabelText}>{mainLabel}</Text>
          {!mainIsLocal && opponentReady && <Text style={styles.readyBadge}>Pronto</Text>}
        </View>
        <View style={styles.opponentTimer}>
          <Text style={styles.opponentTimerText}>
            {mainIsLocal ? "Seu vídeo" : `Oponente ${formatTime(opponentElapsed)}`}
          </Text>
        </View>

        <Pressable style={styles.miniVideo} onPress={() => setMainIsLocal((v) => !v)}>
          {miniStream ? (
            <RTCView
              key={miniStream.toURL()}
              streamURL={miniStream.toURL()}
              style={styles.video}
              objectFit="cover"
              mirror={!mainIsLocal && frontCamera}
              zOrder={1}
            />
          ) : (
            <View style={styles.videoPlaceholder}>
              <CameraOff color="#ffffff" size={23} />
            </View>
          )}
          <View style={styles.miniVideoLabel}>
            <Text style={styles.miniLabelText}>{miniLabel} · trocar</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={toggleMicrophone} style={styles.controlButton}>
          {micEnabled ? <Mic color={colors.textPrimary} size={21} /> : <MicOff color={colors.error} size={21} />}
        </Pressable>
        <Pressable onPress={flipCamera} style={styles.controlButton}>
          <FlipHorizontal2 color={colors.textPrimary} size={21} />
        </Pressable>
        <Pressable onPress={toggleCamera} style={styles.controlButton}>
          {cameraEnabled ? <Camera color={colors.textPrimary} size={21} /> : <CameraOff color={colors.error} size={21} />}
        </Pressable>
        <Pressable onPress={confirmLeave} style={[styles.controlButton, styles.hangupButton]}>
          <PhoneOff color="#ffffff" size={21} />
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [styles.timerArea, pressed && styles.timerPressed]}
        onPressIn={onTimerPressIn}
        onPressOut={onTimerPressOut}
        disabled={waitingOpponent || (!scramble && !isRunning)}
      >
        <Text style={styles.timerOverline}>SEU CRONÔMETRO</Text>
        <Text style={[styles.timerValue, { color: timerColor }]} numberOfLines={1} adjustsFontSizeToFit>
          {formatTime(elapsed)}
        </Text>
        <Text style={styles.timerInstructions}>
          {waitingOpponent
            ? "Aguardando o oponente finalizar..."
            : isRunning
              ? "Toque aqui para parar"
              : isReady
                ? "Solte para começar"
                : !scramble
                  ? "Aguardando o embaralhamento"
                  : "Segure para preparar · solte para iniciar"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const makeStyles = (c: ThemePalette) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bgPrimary },
    header: { height: 52, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    headingGroup: { flexDirection: "row", alignItems: "center", gap: 9 },
    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.success },
    heading: { fontSize: 17, fontWeight: "800", color: c.textPrimary },
    puzzleLabel: { color: c.accent, fontSize: 12, fontWeight: "700" },
    leaveTop: { padding: 8 },
    scrambleCard: { marginHorizontal: 16, marginVertical: 9, backgroundColor: c.cardBg, borderColor: c.borderColor, borderWidth: 1, borderRadius: 16, padding: 14, minHeight: 89, justifyContent: "center" },
    overline: { color: c.textMuted, fontSize: 10, fontWeight: "800", letterSpacing: 1, marginBottom: 8 },
    scrambleText: { color: c.textPrimary, fontSize: 15, fontWeight: "700", textAlign: "center", lineHeight: 23 },
    videoStage: { flex: 1, marginHorizontal: 16, marginTop: 4, borderRadius: 20, overflow: "hidden", backgroundColor: "#171e28", minHeight: 180 },
    video: { width: "100%", height: "100%" },
    videoPlaceholder: { flex: 1, backgroundColor: "#171e28", justifyContent: "center", alignItems: "center", gap: 10 },
    placeholderText: { color: "#e5e7eb", fontSize: 13 },
    mainVideoLabel: { position: "absolute", top: 12, left: 12, backgroundColor: "#00000090", paddingHorizontal: 11, paddingVertical: 7, borderRadius: 9, flexDirection: "row", alignItems: "center", gap: 7 },
    videoLabelText: { color: "#ffffff", fontSize: 12, fontWeight: "700" },
    readyBadge: { color: "#86efac", fontSize: 11 },
    opponentTimer: { position: "absolute", bottom: 12, left: 12, backgroundColor: "#00000090", borderRadius: 9, paddingHorizontal: 10, paddingVertical: 7 },
    opponentTimerText: { color: "#ffffff", fontSize: 12, fontWeight: "700", fontVariant: ["tabular-nums"] },
    miniVideo: { position: "absolute", right: 12, top: 12, width: 112, height: 152, backgroundColor: "#1f2937", borderRadius: 14, overflow: "hidden", borderWidth: 2, borderColor: "#ffffffcc", elevation: 8 },
    miniVideoLabel: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#000000a8", padding: 6 },
    miniLabelText: { color: "#ffffff", fontSize: 10, fontWeight: "700", textAlign: "center" },
    controls: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 14, paddingVertical: 14 },
    controlButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: c.cardBg, borderColor: c.borderColor, borderWidth: 1, alignItems: "center", justifyContent: "center" },
    hangupButton: { backgroundColor: c.error, borderColor: c.error },
    timerArea: { marginHorizontal: 16, marginBottom: 10, minHeight: 143, borderRadius: 20, borderWidth: 1, borderColor: c.borderColor, backgroundColor: c.cardBg, alignItems: "center", justifyContent: "center", paddingHorizontal: 16, paddingVertical: 14 },
    timerPressed: { backgroundColor: c.bgTertiary },
    timerOverline: { color: c.textMuted, fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
    timerValue: { fontSize: 49, fontWeight: "800", letterSpacing: -2, marginVertical: 6, fontVariant: ["tabular-nums"] },
    timerInstructions: { color: c.textSecondary, fontSize: 12, fontWeight: "600", textAlign: "center" },
  });
