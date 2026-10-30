import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { SolveRequest } from "../interface/SolveRequest";
import { Palette, ThemePalette } from "@/constants/pallete";
import useScramble from "@/hooks/scramble/useScramble";
import { useSolveMutate } from "@/hooks/solves/useSolveMutate";
import { useSolveDelete } from "@/hooks/solves/useSolveDelete";
import { useUsuarioLogado } from "@/hooks/usuario/useUsuarioLogado";
import { useSolveDataUser } from "@/hooks/solves/useSolveDataUser";
import { getTypeCubo } from "./profile";

export const puzzles = [
  "2x2x2",
  "3x3x3",
  "4x4x4",
  "5x5x5",
  "6x6x6",
  "7x7x7",
  "square1",
  "megaminx",
  "clock",
  "skewb",
  "pyraminx",
];



type Solve = {
  id: number;
  tempo: number;
  scramble?: string;
  tipoCubo?: string;
  penalty?: string | null;
};

export function formatTime(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);

  const sec = String(seconds).padStart(2, "0");
  const cs = String(centiseconds).padStart(2, "0");

  if (minutes > 0) {
    return `${minutes}:${sec}.${cs}`;
  }

  return `${sec}.${cs}`;
}

function calculateStats(solves: Solve[]) {
  if (solves.length === 0) {
    return {
      total: 0,
      best: null as number | null,
      average: null as number | null,
    };
  }

  const times = solves
    .filter((solve) => solve.penalty !== "DNF")
    .map((solve) =>
      solve.tempo + (solve.penalty === "+2" ? 2000 : 0)
    );

  if (!times.length) {
    return {
      total: solves.length,
      best: null,
      average: null,
    };
  }

  return {
    total: solves.length,
    best: Math.min(...times),
    average: times.reduce((a, b) => a + b, 0) / times.length,
  };
}

export default function Practice() {
  const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [puzzle, setPuzzle] = useState("3x3x3");
  const [scramble, setScramble] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [loadingScramble, setLoadingScramble] = useState(false);

  const { refetch } = useScramble(puzzle);
  const postSolve = useSolveMutate();
  const solveDelete = useSolveDelete();

  const { data: usuarioLogado } = useUsuarioLogado();
  const { data: solvesResponse } = useSolveDataUser(usuarioLogado?.id);

  const solves: Solve[] = Array.isArray(solvesResponse?.data)
    ? solvesResponse.data
    : [];

  const puzzleSolves = useMemo(
    () => solves.filter((s) => !s.tipoCubo || s.tipoCubo === getTypeCubo(puzzle)),
    [solves, puzzle]
  );

  const recentSolves = useMemo(
    () => [...puzzleSolves].reverse(),
    [puzzleSolves]
  );

  const stats = useMemo(
    () => calculateStats(puzzleSolves),
    [puzzleSolves]
  );

  const startTimeRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runningRef = useRef(false);
  const readyRef = useRef(false);
  const activeScrambleRef = useRef("");
  const scrambleRef = useRef("");
  const puzzleRef = useRef(puzzle);
  const generationRef = useRef(0);
 

  const gerarScramble = useCallback(async () => {
    if (runningRef.current) return;

    const requestId = ++generationRef.current;
    setLoadingScramble(true);

    try {
      const response = await refetch();

      if (requestId !== generationRef.current) return;

      if (response.data?.scramble) {
        scrambleRef.current = response.data.scramble;
        setScramble(response.data.scramble);
      }
    } catch {
      if (requestId === generationRef.current) {
        Alert.alert("Erro", "Não foi possível gerar o scramble.");
      }
    } finally {
      if (requestId === generationRef.current) {
        setLoadingScramble(false);
      }
    }
  }, [refetch]);

  useEffect(() => {
    puzzleRef.current = puzzle;
    scrambleRef.current = "";
    setScramble("");
    setElapsed(0);
    readyRef.current = false;
    setIsReady(false);

    // Invalida respostas anteriores ao trocar de puzzle.
    generationRef.current += 1;
  }, [puzzle]);

  useEffect(() => {
    gerarScramble();
  }, [gerarScramble, puzzle]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      generationRef.current += 1;
    };
  }, []);

  const startTimer = () => {
    if (runningRef.current || !scrambleRef.current) return;

    activeScrambleRef.current = scrambleRef.current;

    startTimeRef.current = Date.now();
    runningRef.current = true;
    readyRef.current = false;

    setElapsed(0);
    setIsReady(false);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 30);
  };

  const stopTimer = () => {
    if (!runningRef.current) return;

    const finalTime = Date.now() - startTimeRef.current;

    runningRef.current = false;
    readyRef.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setElapsed(finalTime);
    setIsRunning(false);
    setIsReady(false);

    const request: SolveRequest = {
      tempo: finalTime,
      scramble: activeScrambleRef.current,
      penalty: null,
      userId: usuarioLogado?.id,
      tipoCubo: puzzleRef.current,
    };

    if (usuarioLogado?.id) {
      postSolve.mutate(request);
    }

    gerarScramble();
  };

  const handlePressIn = () => {
    if (runningRef.current) {
      stopTimer();
      return;
    }

    if (loadingScramble || !scrambleRef.current) return;

    readyRef.current = true;
    setIsReady(true);
  };

  const handlePressOut = () => {
    if (!readyRef.current) return;

    readyRef.current = false;
    startTimer();
  };

  const handlePuzzleChange = (selected: string) => {
    if (runningRef.current || selected === puzzle) return;

    setPuzzle(selected);
  };

  const handleDelete = (solve: Solve) => {
    Alert.alert(
      "Excluir resolução",
      `Deseja excluir o tempo ${formatTime(solve.tempo)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => solveDelete.mutate(solve.id),
        },
      ]
    );
  };

  const timerColor = isReady
    ? colors.success
    : isRunning
      ? colors.accent
      : colors.textPrimary;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <FlatList
        data={recentSolves}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.pageTitle}>Praticar</Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>Escolha seu puzzle</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.puzzleScroll}
              contentContainerStyle={styles.puzzleList}
            >
              {puzzles.map((item) => {
                const active = puzzle === item;

                return (
                  <Pressable
                    key={item}
                    disabled={isRunning}
                    onPress={() => handlePuzzleChange(item)}
                    style={[
                      styles.puzzleChip,
                      active && styles.puzzleChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.puzzleText,
                        active && styles.puzzleTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.scrambleCard}>
              <View style={styles.scrambleHeader}>
                <View style={styles.scrambleTitleRow}>
                  <View style={styles.accentDot} />
                  <Text style={styles.scrambleTitle}>Scramble</Text>
                </View>

                <Pressable
                  onPress={gerarScramble}
                  disabled={isRunning || loadingScramble}
                  hitSlop={10}
                  style={styles.refreshButton}
                >
                  {loadingScramble ? (
                    <ActivityIndicator size="small" color={colors.accent} />
                  ) : (
                    <Text style={styles.refreshText}>↻ Novo</Text>
                  )}
                </Pressable>
              </View>

              <Text style={styles.scrambleText}>
                {scramble || (loadingScramble ? "Gerando scramble..." : "Sem scramble")}
              </Text>
            </View>

            <View style={styles.timerSection}>
              <Text style={styles.timerLabel}>
                {isRunning
                  ? "RESOLVENDO"
                  : isReady
                    ? "PRONTO!"
                    : "CRONÔMETRO"}
              </Text>

              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={!scramble && !isRunning}
                style={({ pressed }) => [
                  styles.timerTouchArea,
                  pressed && styles.timerPressed,
                ]}
              >
                <Text
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  style={[styles.timerText, { color: timerColor }]}
                >
                  {formatTime(elapsed)}
                </Text>

                <View
                  style={[
                    styles.timerStatus,
                    isRunning && styles.timerStatusRunning,
                    isReady && styles.timerStatusReady,
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: isRunning || isReady
                          ? colors.success
                          : colors.textMuted,
                      },
                    ]}
                  />
                  <Text style={styles.timerHint}>
                    {isRunning
                      ? "Toque para parar"
                      : isReady
                        ? "Solte para começar"
                        : "Segure e solte para iniciar"}
                  </Text>
                </View>
              </Pressable>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Solves</Text>
                <Text style={styles.statValue}>{stats.total}</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Melhor</Text>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {stats.best !== null ? formatTime(stats.best) : "--"}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Média</Text>
                <Text style={styles.statValue}>
                  {stats.average !== null
                    ? formatTime(stats.average)
                    : "--"}
                </Text>
              </View>
            </View>

            <View style={styles.historyHeader}>
              <View>
                <Text style={styles.historyTitle}>Histórico</Text>
                <Text style={styles.historySubtitle}>
                  Suas resoluções recentes
                </Text>
              </View>

              <View style={styles.countPill}>
                <Text style={styles.countText}>
                  {puzzleSolves.length}
                </Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => handleDelete(item)}
            style={styles.solveRow}
          >
            <View style={styles.solveLeft}>
              <View style={styles.solveNumber}>
                <Text style={styles.solveNumberText}>
                  {puzzleSolves.length - index}
                </Text>
              </View>

              <View>
                <Text style={styles.solveName}>
                  Resolução #{puzzleSolves.length - index}
                </Text>
                <Text style={styles.solveCaption}>{puzzle}</Text>
              </View>
            </View>

            <View style={styles.solveRight}>
              <Text style={styles.solveTime}>
                {item.penalty === "DNF"
                  ? "DNF"
                  : formatTime(
                      item.tempo +
                        (item.penalty === "+2" ? 2000 : 0)
                    )}
              </Text>
              <Text style={styles.solveChevron}>›</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              Nenhuma resolução ainda
            </Text>
            <Text style={styles.emptyDescription}>
              Inicie o cronômetro para registrar seu primeiro tempo.
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={<View style={{ height: 32 }} />}
      />
    </SafeAreaView>
  );
}

const makeStyles = (c: ThemePalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: c.bgPrimary,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 24,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 28,
    },
    eyebrow: {
      color: c.accent,
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 2,
      marginBottom: 6,
    },
    pageTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: c.textPrimary,
      letterSpacing: -0.8,
    },
    subtitle: {
      color: c.textSecondary,
      fontSize: 13,
      marginTop: 4,
    },
    headerIcon: {
      width: 46,
      height: 46,
      borderRadius: 15,
      backgroundColor: c.bgTertiary,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: c.borderColor,
    },
    headerIconText: {
      fontSize: 28,
      color: c.accent,
      fontWeight: "700",
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: c.textSecondary,
      marginBottom: 12,
    },
    puzzleScroll: {
      flexGrow: 0,
      marginHorizontal: -20,
      marginBottom: 22,
    },
    puzzleList: {
      paddingHorizontal: 20,
      gap: 9,
    },
    puzzleChip: {
      paddingHorizontal: 17,
      paddingVertical: 11,
      borderRadius: 13,
      backgroundColor: c.cardBg,
      borderWidth: 1,
      borderColor: c.borderColor,
    },
    puzzleChipActive: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    puzzleText: {
      fontSize: 13,
      fontWeight: "700",
      color: c.textSecondary,
    },
    puzzleTextActive: {
      color: c.accentText,
    },
    scrambleCard: {
      backgroundColor: c.cardBg,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: c.borderColor,
    },
    scrambleHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 17,
    },
    scrambleTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
    },
    accentDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.accent,
    },
    scrambleTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: c.textPrimary,
    },
    refreshButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 9,
      backgroundColor: c.bgTertiary,
    },
    refreshText: {
      fontSize: 12,
      fontWeight: "700",
      color: c.accent,
    },
    scrambleText: {
      color: c.textPrimary,
      fontSize: 19,
      fontWeight: "600",
      textAlign: "center",
      lineHeight: 32,
      letterSpacing: 0.4,
    },
    timerSection: {
      alignItems: "center",
      marginTop: 32,
      marginBottom: 30,
    },
    timerLabel: {
      fontSize: 11,
      color: c.textMuted,
      fontWeight: "800",
      letterSpacing: 2,
      marginBottom: 12,
    },
    timerTouchArea: {
      width: "100%",
      minHeight: 185,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 22,
    },
    timerPressed: {
      backgroundColor: c.bgTertiary,
    },
    timerText: {
      fontSize: 72,
      fontWeight: "700",
      letterSpacing: -3,
      fontVariant: ["tabular-nums"],
      textAlign: "center",
      width: "100%",
      includeFontPadding: false,
    },
    timerStatus: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 15,
      paddingVertical: 9,
      borderRadius: 30,
      backgroundColor: c.bgTertiary,
      marginTop: 20,
    },
    timerStatusRunning: {
      backgroundColor: c.bgTertiary,
    },
    timerStatusReady: {
      backgroundColor: c.bgTertiary,
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    timerHint: {
      color: c.textSecondary,
      fontSize: 12,
      fontWeight: "600",
    },
    statsRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 34,
    },
    statCard: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.cardBg,
      borderWidth: 1,
      borderColor: c.borderColor,
      paddingVertical: 19,
      paddingHorizontal: 4,
      borderRadius: 17,
    },
    statLabel: {
      fontSize: 11,
      color: c.textMuted,
      fontWeight: "700",
      marginBottom: 8,
    },
    statValue: {
      color: c.textPrimary,
      fontSize: 18,
      fontWeight: "800",
      fontVariant: ["tabular-nums"],
    },
    historyHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 17,
    },
    historyTitle: {
      color: c.textPrimary,
      fontSize: 19,
      fontWeight: "800",
    },
    historySubtitle: {
      color: c.textSecondary,
      fontSize: 12,
      marginTop: 4,
    },
    countPill: {
      backgroundColor: c.bgTertiary,
      paddingHorizontal: 13,
      paddingVertical: 7,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.borderColor,
    },
    countText: {
      color: c.accent,
      fontWeight: "800",
      fontSize: 12,
    },
    solveRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 15,
      paddingHorizontal: 4,
    },
    solveLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 13,
      flex: 1,
    },
    solveNumber: {
      width: 39,
      height: 39,
      borderRadius: 13,
      backgroundColor: c.bgTertiary,
      justifyContent: "center",
      alignItems: "center",
    },
    solveNumberText: {
      color: c.textSecondary,
      fontSize: 13,
      fontWeight: "800",
    },
    solveName: {
      color: c.textPrimary,
      fontSize: 13,
      fontWeight: "700",
    },
    solveCaption: {
      color: c.textMuted,
      fontSize: 11,
      marginTop: 4,
    },
    solveRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    solveTime: {
      color: c.textPrimary,
      fontSize: 17,
      fontWeight: "800",
      fontVariant: ["tabular-nums"],
    },
    solveChevron: {
      color: c.textMuted,
      fontSize: 24,
      fontWeight: "300",
    },
    separator: {
      height: 1,
      backgroundColor: c.borderColor,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 45,
      paddingHorizontal: 20,
    },
    emptyTitle: {
      color: c.textPrimary,
      fontSize: 15,
      fontWeight: "700",
      marginBottom: 8,
    },
    emptyDescription: {
      color: c.textSecondary,
      fontSize: 12,
      textAlign: "center",
      lineHeight: 19,
    },
  });
