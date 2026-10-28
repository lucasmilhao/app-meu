/**
 * Espelha as variáveis CSS do web (:root e [data-theme="dark"]).
 * Uso: const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
 */
export type ThemePalette = {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentText: string;
  borderColor: string;
  borderLight: string;
  accent: string;
  accentHover: string;
  accentDisabled: string;
  success: string;
  error: string;
  cardBg: string;
  inputBg: string;
  shadowOpacity: number;
};

export const Palette: Record<"light" | "dark", ThemePalette> = {
  light: {
    bgPrimary: "#f8f9fa",
    bgSecondary: "#ffffff",
    bgTertiary: "#f0f4ff",
    textPrimary: "#333333",
    textSecondary: "#6b7280",
    textMuted: "#9ca3af",
    accentText: "#f8f9fa",
    borderColor: "#e5e7eb",
    borderLight: "#d0dcff",
    accent: "#0242f1",
    accentHover: "#205bff",
    accentDisabled: "#2d4b9e",
    success: "#10b981",
    error: "#ef4444",
    cardBg: "#ffffff",
    inputBg: "#ffffff",
    shadowOpacity: 0.08,
  },
  dark: {
    bgPrimary: "#121212",
    bgSecondary: "#050505ef",
    bgTertiary: "#0f0f0f",
    textPrimary: "#e5e7eb",
    textSecondary: "#9ca3af",
    textMuted: "#6b7280",
    accentText: "#121212",
    borderColor: "#374151",
    borderLight: "#4b5563",
    accent: "#cebc18",
    accentHover: "#ffe926",
    accentDisabled: "#8f860da8",
    success: "#34d399",
    error: "#f87171",
    cardBg: "#0e0d0d",
    inputBg: "#0f1011",
    shadowOpacity: 0.4,
  },
};