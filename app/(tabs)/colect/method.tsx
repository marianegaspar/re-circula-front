import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppFonts } from "../../../hooks/use-App-Fonts";
import { COLORS } from "../../themes";

const DROP_OFF_POINTS = [
  {
    id: "eco-sp",
    name: "Centro Logístico EcoSP",
    address: "Av. das Nações, 1200 - Santo Amaro",
    hours: "Seg a Sex, 08h às 18h",
    distance: "1.2km",
  },
  {
    id: "tech-moema",
    name: "Ponto Tech Moema",
    address: "Rua Canário, 480 - Moema",
    hours: "Seg a Sáb, 09h às 17h",
    distance: "2.5km",
  },
] as const;

export default function ColectMethod() {
  const router = useRouter();
  const params = useLocalSearchParams<{ selectedItems?: string }>();
  const { fontsLoaded } = useAppFonts();
  const selectedItems = params.selectedItems || "[]";

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.onSurface} />
        </TouchableOpacity>

        <View style={styles.stepContainer}>
          <View style={styles.stepLine} />

          <View style={styles.stepWrapper}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>1</Text>
            </View>
            <Text style={styles.stepLabel}>Itens</Text>
          </View>

          <View style={styles.stepWrapper}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={styles.stepDotTextActive}>2</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Destino</Text>
          </View>

          <View style={styles.stepWrapper}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Confirma</Text>
          </View>
        </View>

        <Text style={styles.title}>Como quer descartar?</Text>
        <Text style={styles.subtitle}>
          Escolha entre agendar uma coleta no endereço cadastrado ou entregar os
          itens em um ponto físico parceiro.
        </Text>

        <TouchableOpacity
          style={styles.mainOptionCard}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: "/colect/schedule",
              params: {
                selectedItems,
                deliveryType: "pickup",
              },
            })
          }
        >
          <View style={styles.optionIconBox}>
            <MaterialIcons name="local-shipping" size={28} color={COLORS.primary} />
          </View>

          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Agendar coleta</Text>
            <Text style={styles.optionDescription}>
              Escolha uma data e um período para retirarmos os itens com você.
            </Text>
          </View>

          <MaterialIcons name="chevron-right" size={26} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Entregar em ponto físico</Text>
          <Text style={styles.sectionHint}>Selecione um local</Text>
        </View>

        <View style={styles.pointsList}>
          {DROP_OFF_POINTS.map((point) => (
            <TouchableOpacity
              key={point.id}
              style={styles.pointCard}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/colect/revision",
                  params: {
                    selectedItems,
                    deliveryType: "dropoff",
                    pointId: point.id,
                    pointName: point.name,
                    pointAddress: point.address,
                    pointHours: point.hours,
                  },
                })
              }
            >
              <View style={styles.pointIconBox}>
                <MaterialIcons name="location-on" size={24} color={COLORS.primary} />
              </View>

              <View style={styles.pointContent}>
                <View style={styles.pointTitleRow}>
                  <Text style={styles.pointName}>{point.name}</Text>
                  <Text style={styles.pointDistance}>{point.distance}</Text>
                </View>
                <Text style={styles.pointAddress}>{point.address}</Text>
                <Text style={styles.pointHours}>{point.hours}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 32,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    marginBottom: 24,
  },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 240,
    alignSelf: "center",
    marginBottom: 34,
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
    backgroundColor: COLORS.primaryContainer,
  },
  stepDotText: {
    color: "#bbcabf",
    fontWeight: "bold",
  },
  stepDotTextActive: {
    color: COLORS.onPrimary,
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
    color: COLORS.primary,
  },
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.onSurface,
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 15,
    color: COLORS.onSurfaceVariant,
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 24,
  },
  mainOptionCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(78, 222, 163, 0.24)",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
  },
  optionIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(78, 222, 163, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 18,
    marginBottom: 4,
  },
  optionDescription: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 18,
  },
  sectionHint: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 13,
    marginTop: 4,
  },
  pointsList: {
    gap: 12,
  },
  pointCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    gap: 12,
  },
  pointIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(78, 222, 163, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  pointContent: {
    flex: 1,
  },
  pointTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 6,
  },
  pointName: {
    flex: 1,
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 15,
  },
  pointDistance: {
    color: COLORS.primary,
    fontFamily: "Manrope-Bold",
    fontSize: 12,
  },
  pointAddress: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  pointHours: {
    color: COLORS.secondary,
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    marginTop: 6,
  },
});
