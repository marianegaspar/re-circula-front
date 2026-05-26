import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { COLORS } from "../themes";

export default function CollectConfirmation() {
  const [collectionModalVisible, setCollectionModalVisible] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },

  scrollContent: {},

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  logoText: {
    fontFamily: "Manrope-Bold",
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.primary,
    marginLeft: 8,
    letterSpacing: -1,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.onSurface,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
    marginBottom: 24,
  },

  bentoGrid: { gap: 16, marginBottom: 16 },
  mainImpactCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.outline + "10",
    overflow: "hidden",
  },
  // Step Indicator
  stepContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 240,
    alignSelf: "center",
    marginBottom: 40,
    position: "relative",
  },
  stepLine: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: "#2d3449",
    zIndex: 0,
  },
  stepWrapper: {
    alignItems: "center",
    zIndex: 1,
    gap: 6,
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2d3449",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotActive: {
    backgroundColor: "#10b981",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  stepDotText: {
    color: "#bbcabf",
    fontWeight: "bold",
  },
  stepDotTextActive: {
    color: "#003824",
    fontWeight: "bold",
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#bbcabf",
  },
  stepLabelActive: {
    color: "#4edea3",
  },

  // Editorial Header
  editorialContainer: {
    marginBottom: 32,
  },
  tituloPrincipal: {
    fontSize: 32,
    fontWeight: "800",
    color: "#dae2fd",
    lineHeight: 40,
    marginBottom: 12,
  },
  textHighlight: {
    color: "#4edea3",
  },
  subtituloPrincipal: {
    fontSize: 15,
    color: "#bbcabf",
    lineHeight: 22,
    maxWidth: 320,
  },
  // Grid Categorias
  gridCategorias: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  cardCategoria: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    position: "relative",
  },
  cardCategoriaUnselected: {
    backgroundColor: "#131b2e",
    borderColor: "rgba(60, 74, 66, 0.2)",
  },
  cardCategoriaSelected: {
    backgroundColor: "#222a3d",
    borderColor: "#4edea3",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  checkIconPosition: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconWrapperUnselected: {
    backgroundColor: "#2d3449",
  },
  iconWrapperSelected: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  cardTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#dae2fd",
  },
  cardSubtitulo: {
    fontSize: 10,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: -0.3,
  },
  cardSubtituloUnselected: {
    color: "#bbcabf",
  },
  cardSubtituloSelected: {
    color: "#4edea3",
  },
  summaryCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.18)",
    padding: 20,
    marginBottom: 24,
  },
  summaryCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryCardCountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryCardCount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#dae2fd",
    marginBottom: 0,
  },
  summaryCardSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#f87171",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryCardAction: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: 8,
  },

  // Bento Quantity
  bentoContainer: {
    backgroundColor: "#060e20",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 24,
  },
  bentoLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#bbcabf",
    marginBottom: 16,
  },
  contadorControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#171f33",
    borderRadius: 30,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(60, 74, 66, 0.2)",
  },
  btnContadorAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2d3449",
    justifyContent: "center",
    alignItems: "center",
  },
  btnContadorActionPlus: {
    backgroundColor: "#10b981",
  },
  btnContadorTexto: {
    color: "#dae2fd",
    fontSize: 20,
    fontWeight: "bold",
  },
  btnContadorTextoPlus: {
    color: "#003824",
  },
  contadorValor: {
    fontSize: 28,
    fontWeight: "800",
    color: "#dae2fd",
  },
  // Impact Banner
  impactBanner: {
    backgroundColor: "rgba(6, 78, 59, 0.2)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginBottom: 40,
  },
  impactIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  impactTextWrapper: {
    flex: 1,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#dae2fd",
    marginBottom: 4,
  },
  impactDescription: {
    fontSize: 13,
    color: "#bbcabf",
    lineHeight: 18,
  },
  impactHighlight: {
    color: "#34d399",
    fontWeight: "700",
  },
  // Footer Button
  footerActionContainer: {
    alignItems: "center",
    gap: 16,
  },
  btnPrincipal: {
    width: "100%",
    maxWidth: 340,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  btnPrincipalTexto: {
    color: "#003824",
    fontSize: 16,
    fontWeight: "700",
  },
  infoTaxaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoTaxaTexto: {
    fontSize: 11,
    color: "#bbcabf",
  },
  // Bottom Navigation Bar
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 12 : 0,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    gap: 4,
  },
  navItemActive: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  navText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  navTextActive: {
    color: "#4edea3",
    fontWeight: "700",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  modalContent: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.outline + "10",
    marginTop: 80,
  },

  modalTitle: {
    fontFamily: "Manrope-Bold",
    fontSize: 20,
    color: COLORS.onSurface,
    marginBottom: 12,
  },
  modalBody: {
    fontFamily: "Manrope-Regular",
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    marginBottom: 24,
    lineHeight: 22,
  },
  modalCloseButton: {
    width: "100%",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
  },
  modalCloseText: {
    color: COLORS.onPrimary,
    fontFamily: "Manrope-Bold",
    fontSize: 14,
    textAlign: "center",
  },
  modalBackButton: {
    position: "absolute",
    top: 32,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline + "10",
  },
  modalItemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  modalItemLabel: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Regular",
    fontSize: 16,
  },
  qtyControls: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonPlus: { backgroundColor: COLORS.primary },
  qtyText: { color: COLORS.onSurface, fontWeight: "700" },
  qtyTextPlus: { color: COLORS.onPrimary },
  qtyNumber: { color: COLORS.onSurface, minWidth: 20, textAlign: "center" },
});
