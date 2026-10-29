import { useMemo, useState } from "react";
import {
    LayoutChangeEvent,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";

import Svg, {
    Circle,
    G,
    Line,
    Path,
    Text as SvgText,
} from "react-native-svg";

import * as d3 from "d3";
import { Palette, ThemePalette } from "@/constants/pallete";

interface Solve {
    id: number;
    tempo: number;
}

interface SolveChartProps {
    solves: Solve[];
}

type ChartData = {
    index: number;
    id: number;
    tempo: number;
};

const HEIGHT = 350;

const MARGIN = {
    top: 30,
    right: 20,
    bottom: 50,
    left: 60,
};

export function SolveChart({ solves }: SolveChartProps) {
    const [width, setWidth] = useState(0);
    const [selected, setSelected] = useState<ChartData | null>(null);


    const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
    const styles = useMemo(() => makeStyles(colors), [colors]);

    const handleLayout = (event: LayoutChangeEvent) => {
        const newWidth = event.nativeEvent.layout.width;

        setWidth((previous) =>
            previous === newWidth ? previous : newWidth
        );
    };

    const data: ChartData[] = useMemo(
        () =>
            solves.map((solve, index) => ({
                index: index + 1,
                id: solve.id,
                tempo: solve.tempo / 1000,
            })),
        [solves]
    );

    const chartWidth = Math.max(
        0,
        width - MARGIN.left - MARGIN.right
    );

    const chartHeight =
        HEIGHT - MARGIN.top - MARGIN.bottom;

    const minTempo = d3.min(data, (d: Solve) => d.tempo) ?? 0;
    const maxTempo = d3.max(data, (d: Solve) => d.tempo) ?? 10;

    const yPadding = Math.max(
        (maxTempo - minTempo) * 0.15,
        1
    );

    const x = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain([1, Math.max(data.length, 2)])
                .range([0, chartWidth]),
        [data.length, chartWidth]
    );

    const y = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain([
                    Math.max(0, minTempo - yPadding),
                    maxTempo + yPadding,
                ])
                .nice()
                .range([chartHeight, 0]),
        [minTempo, maxTempo, yPadding, chartHeight]
    );

    const yTicks = y.ticks(6);

    const xTicks = useMemo(() => {
        if (data.length <= 10) {
            return data.map((d) => d.index);
        }

        return x.ticks(10).map(Math.round).filter(
            (value, index, array) =>
                value >= 1 &&
                value <= data.length &&
                array.indexOf(value) === index
        );
    }, [data.length, x]);

    const lineGenerator = useMemo(
        () =>
            d3
                .line<ChartData>()
                .x((d) => x(d.index))
                .y((d) => y(d.tempo))
                .curve(d3.curveMonotoneX),
        [x, y]
    );

    const areaGenerator = useMemo(
        () =>
            d3
                .area<ChartData>()
                .x((d) => x(d.index))
                .y0(chartHeight)
                .y1((d) => y(d.tempo))
                .curve(d3.curveMonotoneX),
        [x, y, chartHeight]
    );

    const linePath = lineGenerator(data) ?? undefined;
    const areaPath = areaGenerator(data) ?? undefined;

    const selectedX = selected ? x(selected.index) : 0;
    const selectedY = selected ? y(selected.tempo) : 0;

    const tooltipWidth = 140;

    const tooltipLeft = Math.max(
        0,
        Math.min(
            MARGIN.left + selectedX - tooltipWidth / 2,
            width - tooltipWidth
        )
    );

    const tooltipTop = Math.max(
        0,
        MARGIN.top + selectedY - 65
    );

    if (!solves.length) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyText}>
                    Sem resoluções para exibir.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container} onLayout={handleLayout}>
            {width > 0 && (
                <>
                    <Svg
                        width={width}
                        height={HEIGHT}
                    >
                        <G
                            x={MARGIN.left}
                            y={MARGIN.top}
                        >
                            {/* Grade horizontal */}
                            {yTicks.map((tick) => (
                                <Line
                                    key={`grid-${tick}`}
                                    x1={0}
                                    y1={y(tick)}
                                    x2={chartWidth}
                                    y2={y(tick)}
                                    stroke="#E5E7EB"
                                    strokeWidth={1}
                                />
                            ))}

                            {/* Eixo Y */}
                            <Line
                                x1={0}
                                y1={0}
                                x2={0}
                                y2={chartHeight}
                                stroke="#9CA3AF"
                            />

                            {yTicks.map((tick) => (
                                <G key={`y-${tick}`}>
                                    <Line
                                        x1={-5}
                                        y1={y(tick)}
                                        x2={0}
                                        y2={y(tick)}
                                        stroke="#9CA3AF"
                                    />

                                    <SvgText
                                        x={-10}
                                        y={y(tick) + 4}
                                        fontSize={11}
                                        fill="#6B7280"
                                        textAnchor="end"
                                    >
                                        {`${Number(tick).toFixed(1)}s`}
                                    </SvgText>
                                </G>
                            ))}

                            {/* Eixo X */}
                            <Line
                                x1={0}
                                y1={chartHeight}
                                x2={chartWidth}
                                y2={chartHeight}
                                stroke="#9CA3AF"
                            />

                            {xTicks.map((tick) => (
                                <G key={`x-${tick}`}>
                                    <Line
                                        x1={x(tick)}
                                        y1={chartHeight}
                                        x2={x(tick)}
                                        y2={chartHeight + 5}
                                        stroke="#9CA3AF"
                                    />

                                    <SvgText
                                        x={x(tick)}
                                        y={chartHeight + 20}
                                        fontSize={11}
                                        fill="#6B7280"
                                        textAnchor="middle"
                                    >
                                        {tick}
                                    </SvgText>
                                </G>
                            ))}

                            {/* Área abaixo da linha */}
                            <Path
                                d={areaPath}
                                fill={colors.accent}
                                fillOpacity={0.12}
                            />

                            {/* Linha das resoluções */}
                            <Path
                                d={linePath}
                                stroke={colors.accent}
                                strokeWidth={2.5}
                                fill="none"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />

                            {/* Pontos interativos */}
                            {data.map((item) => {
                                const isSelected = selected?.id === item.id;

                                return (
                                    <G key={`${item.id}-${item.index}`}>
                                        {isSelected && (
                                            <Circle
                                                cx={x(item.index)}
                                                cy={y(item.tempo)}
                                                r={9}
                                                fill={colors.accent}
                                                fillOpacity={0.18}
                                            />
                                        )}

                                        <Circle
                                            cx={x(item.index)}
                                            cy={y(item.tempo)}
                                            r={isSelected ? 5 : 4}
                                            fill={colors.accent}
                                            stroke="#ffffff91"
                                            strokeWidth={1.5}
                                            onPress={() =>
                                                setSelected((previous) =>
                                                    previous?.id === item.id &&
                                                        previous.index === item.index
                                                        ? null
                                                        : item
                                                )
                                            }
                                        />
                                    </G>
                                );
                            })}

                            {/* Título do eixo X */}
                            <SvgText
                                x={chartWidth / 2}
                                y={chartHeight + 42}
                                fontSize={12}
                                fill="#374151"
                                textAnchor="middle"
                            >
                                Resolução
                            </SvgText>

                            {/* Título do eixo Y */}
                            <SvgText
                                x={-chartHeight / 2}
                                y={-42}
                                fontSize={12}
                                fill="#374151"
                                textAnchor="middle"
                                rotation={-90}
                            >
                                Tempo
                            </SvgText>
                        </G>
                    </Svg>

                    {/* Tooltip nativo */}
                    {selected && (
                        <View
                            style={[
                                styles.tooltip,
                                {
                                    left: tooltipLeft,
                                    top: tooltipTop,
                                    width: tooltipWidth,
                                },
                            ]}
                            pointerEvents="none"
                        >
                            <Text style={styles.tooltipTitle}>
                                Resolução #{selected.index}
                            </Text>

                            <Text style={styles.tooltipValue}>
                                {selected.tempo.toFixed(2)}s
                            </Text>
                        </View>
                    )}
                </>
            )}
        </View>
    );
}


const makeStyles = (c: ThemePalette) => StyleSheet.create({
        container: {
            width: "100%",
            position: "relative",
            backgroundColor: c.bgPrimary,
        },

        emptyText: {
            padding: 20,
            textAlign: "center",
            fontSize: 14,
            color: c.textMuted,
        },

        tooltip: {
            position: "absolute",
            backgroundColor: c.accentDisabled,
            paddingHorizontal: 12,
            paddingVertical: 9,
            borderRadius: 8,
            elevation: 5,
        },

        tooltipTitle: {
            fontSize: 12,
            fontWeight: "600",
            color: c.bgPrimary,
        },

        tooltipValue: {
            marginTop: 4,
            fontSize: 14,
            fontWeight: "700",
            color: c.accent,
        },
    });