import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppFonts } from "../hooks/use-App-Fonts";
import { COLORS } from "./themes";

export default function OnBoarding() {
  const router = useRouter();
  const { fontsLoaded } = useAppFonts();

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Brand/Logo */}
      <View style={styles.brand}>
        <MaterialIcons name="bolt" size={28} color={COLORS.primary} />
        <Text style={styles.logoText}>ReCircula</Text>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.title}>
          Dê um destino certo aos seus{" "}
          <Text style={styles.titleHighlight}>eletrônicos</Text>
        </Text>
        <Text style={styles.subtitle}>
          Conectamos você aos pontos de coleta mais próximos e empresas comprometidas com o descarte responsável.
        </Text>
      </View>

      {/* Feature Card (Simples) */}
      <View style={[styles.card, styles.mapCard]}>
        <View style={[styles.cardIconWrap, styles.mapIconWrap]}>
          <Ionicons name="location-outline" size={24} color={COLORS.tertiary} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>Encontre pontos de descarte</Text>
            <View style={[styles.pointsBadge, styles.greenBadge]}>
              <Text style={[styles.pointsBadgeText, styles.greenBadgeText]}>+50 pts</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>Visualize no mapa as cooperativas mais próximas de você.</Text>
        </View>
      </View>

         {/* Feature Card (Simples) */}
      <View style={[styles.card, styles.collectCard]}>
        <View style={[styles.cardIconWrap, styles.collectIconWrap]}>
          <MaterialIcons name="local-shipping" size={26} color={COLORS.blue} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>Agende sua coleta</Text>
            <View style={[styles.pointsBadge, styles.blueBadge]}>
              <Text style={[styles.pointsBadgeText, styles.blueBadgeText]}>+80 pts</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>Leve ao ponto ou agende a retirada com nossos parceiros logísticos.</Text>
        </View>
      </View>

     {/* Feature Card (Simples) */}
      <View style={[styles.card, styles.rewardCard]}>
        <View style={[styles.cardIconWrap, styles.rewardIconWrap]}>
         <MaterialIcons name="star-outline" size={28} color="#c084fc" />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>Ganhe recompensas</Text>
            <View style={[styles.pointsBadge, styles.levelBadge]}>
              <Text style={[styles.pointsBadgeText, styles.levelBadgeText]}>🏆 níveis</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Troque ecopontos por descontos, produtos e serviços sustentáveis.
          </Text>
        </View>
      </View>

      {/* Bottom Action */}
      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/login")}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Iniciar Jornada</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    gap: 20,
    width: "100%",
  maxWidth: Platform.OS === "web" ? 500 : "100%",
  alignSelf: "center",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
  logoText: {
    fontFamily: "Manrope-Bold",
    fontSize: 22,
    color: COLORS.primary,
    marginLeft: 8,
  },
  hero: {
    marginTop: 20,
  },
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 26,
    color: COLORS.onSurface,
    lineHeight: 34,
    marginBottom: 12,
  },
  titleHighlight: {
    color: COLORS.primary,
  },
  subtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 15,
    color: COLORS.onSurfaceVariant,
    lineHeight: 22,
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceContainerLow || "#162230", // Fallback caso não exista no theme
    padding: 14,
    borderRadius: 20,
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  mapCard: {
    backgroundColor: "rgba(12, 55, 52, 0.45)",
    borderColor: "rgba(78, 222, 163, 0.22)",
  },
  collectCard: {
    backgroundColor: "rgba(20, 45, 72, 0.45)",
    borderColor: "rgba(79, 163, 232, 0.22)",
  },
  rewardCard: {
    backgroundColor: "rgba(45, 38, 72, 0.45)",
    borderColor: "rgba(192, 132, 252, 0.22)",
  },
  cardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "rgba(78, 222, 163, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  mapIconWrap: {
    backgroundColor: "rgba(78, 222, 163, 0.12)",
  },
  collectIconWrap: {
    backgroundColor: "rgba(79, 163, 232, 0.12)",
  },
  rewardIconWrap: {
    backgroundColor: "rgba(192, 132, 252, 0.14)",
  },
  cardContent: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  cardTitle: {
    flex: 1,
    fontFamily: "Manrope-Bold",
    fontSize: 14,
    color: COLORS.onSurface,
    lineHeight: 18,
  },
  cardDesc: {
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
    lineHeight: 18,
  },
  pointsBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pointsBadgeText: {
    fontFamily: "Manrope-Bold",
    fontSize: 11,
  },
  greenBadge: {
    backgroundColor: "rgba(78, 222, 163, 0.14)",
  },
  greenBadgeText: {
    color: COLORS.primary,
  },
  blueBadge: {
    backgroundColor: "rgba(79, 163, 232, 0.14)",
  },
  blueBadgeText: {
    color: COLORS.blue,
  },
  levelBadge: {
    backgroundColor: "rgba(192, 132, 252, 0.16)",
  },
  levelBadgeText: {
    color: "#d8b4fe",
  },
  footer: {
    marginTop: "auto", // Empurra o botão para o final
    paddingBottom: 20,
  },
  submitButton: {
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: COLORS.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
