import { StyleSheet } from "@react-pdf/renderer";

export const pdfTheme = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    color: "#111827",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  card: {
    border: "1 solid #E5E7EB",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    color: "#6B7280",
  },

  value: {
    fontWeight: "bold",
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
    marginTop: 30,
    fontSize: 10,
    textAlign: "center",
    color: "#9CA3AF",
  },
});