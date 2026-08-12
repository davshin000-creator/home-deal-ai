import {
  StyleSheet,
} from "@react-pdf/renderer";

export const pdfTheme =
  StyleSheet.create({
    page: {
      padding: 38,
      fontSize: 10.5,
      fontFamily: "Helvetica",
      backgroundColor: "#F8FAFC",
      color: "#0F172A",
    },

    eyebrow: {
      fontSize: 10,
      fontWeight: "bold",
      letterSpacing: 2,
      color: "#0891B2",
      marginBottom: 18,
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 6,
    },

    subtitle: {
      fontSize: 14,
      color: "#64748B",
      marginBottom: 24,
    },

    coverHero: {
      padding: 28,
      borderRadius: 18,
      backgroundColor: "#0F172A",
      color: "#FFFFFF",
      marginBottom: 20,
    },

    coverTitle: {
      fontSize: 30,
      fontWeight: "bold",
      lineHeight: 1.15,
      marginBottom: 12,
    },

    coverAddress: {
      fontSize: 13,
      color: "#CBD5E1",
      marginBottom: 26,
    },

    coverScoreRow: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "flex-end",
      marginBottom: 24,
    },

    scoreLabel: {
      fontSize: 8,
      color: "#94A3B8",
      textTransform: "uppercase",
      letterSpacing: 1.2,
      marginBottom: 5,
    },

    coverScore: {
      fontSize: 35,
      fontWeight: "bold",
      color: "#67E8F9",
    },

    coverGrade: {
      fontSize: 35,
      fontWeight: "bold",
      color: "#C4B5FD",
    },

    recommendationBox: {
      padding: 15,
      borderRadius: 12,
      backgroundColor: "#164E63",
    },

    recommendationLabel: {
      fontSize: 8,
      color: "#A5F3FC",
      letterSpacing: 1.1,
      marginBottom: 5,
    },

    recommendationValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#FFFFFF",
    },

    pageNumber: {
      fontSize: 8,
      fontWeight: "bold",
      color: "#0891B2",
      letterSpacing: 1.5,
      marginBottom: 12,
    },

    section: {
      marginBottom: 22,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
    },

    sectionTitleLarge: {
      fontSize: 25,
      fontWeight: "bold",
      marginBottom: 18,
    },

    subheading: {
      fontSize: 13,
      fontWeight: "bold",
      marginBottom: 10,
    },

    card: {
      border: "1 solid #E2E8F0",
      borderRadius: 10,
      padding: 14,
      marginBottom: 12,
      backgroundColor: "#FFFFFF",
    },

    row: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginBottom: 7,
    },

    label: {
      color: "#64748B",
      fontSize: 9,
    },

    labelLight: {
      color: "#BAE6FD",
      fontSize: 8,
      fontWeight: "bold",
      letterSpacing: 1,
    },

    value: {
      fontWeight: "bold",
    },

    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent:
        "space-between",
      marginBottom: 18,
    },

    metricCard: {
      width: "48.5%",
      border: "1 solid #E2E8F0",
      borderRadius: 10,
      padding: 14,
      marginBottom: 10,
      backgroundColor: "#FFFFFF",
    },

    metricValue: {
      marginTop: 7,
      fontSize: 17,
      fontWeight: "bold",
      color: "#0F172A",
    },

    metricValueSmall: {
      marginTop: 7,
      fontSize: 13,
      fontWeight: "bold",
      color: "#0F172A",
    },

    bodyText: {
      marginTop: 8,
      fontSize: 10,
      lineHeight: 1.6,
      color: "#334155",
    },

    bodyMuted: {
      fontSize: 9,
      lineHeight: 1.5,
      color: "#64748B",
      marginBottom: 14,
    },

    bodyLight: {
      fontSize: 9,
      lineHeight: 1.5,
      color: "#E2E8F0",
      marginTop: 5,
    },

    twoColumn: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginBottom: 18,
    },

    halfColumn: {
      width: "48.5%",
      borderRadius: 10,
      padding: 13,
      backgroundColor: "#FFFFFF",
      border: "1 solid #E2E8F0",
    },

    bulletPositive: {
      fontSize: 9,
      lineHeight: 1.5,
      color: "#166534",
      marginBottom: 6,
    },

    bulletWarning: {
      fontSize: 9,
      lineHeight: 1.5,
      color: "#9A3412",
      marginBottom: 6,
    },

    forecastPanel: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginBottom: 24,
    },

    forecastColumn: {
      width: "31.5%",
      padding: 14,
      borderRadius: 10,
      backgroundColor: "#FFFFFF",
      border: "1 solid #E2E8F0",
    },

    forecastColumnPrimary: {
      width: "31.5%",
      padding: 14,
      borderRadius: 10,
      backgroundColor: "#0E7490",
    },

    forecastValue: {
      fontSize: 15,
      fontWeight: "bold",
      marginTop: 7,
    },

    forecastValueLight: {
      fontSize: 15,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginTop: 7,
    },

    timelineRow: {
      marginBottom: 15,
    },

    timelineHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      marginBottom: 6,
    },

    timelineYear: {
      fontSize: 9,
      fontWeight: "bold",
    },

    timelineValue: {
      fontSize: 9,
      fontWeight: "bold",
      color: "#0891B2",
    },

    barTrack: {
      height: 9,
      borderRadius: 20,
      backgroundColor: "#E2E8F0",
    },

    barFill: {
      height: 9,
      borderRadius: 20,
      backgroundColor: "#06B6D4",
    },

    bestComparable: {
      padding: 18,
      borderRadius: 12,
      backgroundColor: "#0F766E",
      marginBottom: 16,
    },

    bestComparableAddress: {
      marginTop: 7,
      fontSize: 17,
      fontWeight: "bold",
      color: "#FFFFFF",
    },

    compAddress: {
      fontSize: 11,
      fontWeight: "bold",
      marginBottom: 10,
    },

    strategyBox: {
      padding: 16,
      borderRadius: 10,
      backgroundColor: "#F1F5F9",
      marginBottom: 15,
    },

    finalRecommendation: {
      padding: 20,
      borderRadius: 14,
      backgroundColor: "#1E293B",
      marginTop: 16,
      marginBottom: 18,
    },

    finalRecommendationTitle: {
      marginTop: 7,
      fontSize: 22,
      fontWeight: "bold",
      color: "#FFFFFF",
    },

    disclaimer: {
      padding: 14,
      borderRadius: 9,
      backgroundColor: "#FFF7ED",
      border: "1 solid #FED7AA",
    },

    disclaimerTitle: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#9A3412",
      marginBottom: 7,
    },

    disclaimerText: {
      fontSize: 8,
      lineHeight: 1.5,
      color: "#7C2D12",
    },

    success: {
      color: "#16A34A",
    },

    warning: {
      color: "#EA580C",
    },

    danger: {
      color: "#DC2626",
    },

    footer: {
      marginTop: "auto",
      paddingTop: 16,
      fontSize: 8,
      textAlign: "center",
      color: "#94A3B8",
    },
  });
