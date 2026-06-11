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
      <View style={styles.card}>
        <View style={styles.cardIconWrap}>
          <Ionicons name="location-outline" size={24} color={COLORS.tertiary} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Encontre pontos de descarte</Text>
          <Text style={styles.cardDesc}>Visualize no mapa as cooperativas mais próximas de você.</Text>
        </View>
      </View>

         {/* Feature Card (Simples) */}
      <View style={styles.card}>
        <View style={styles.cardIconWrap}>
          <MaterialIcons name="local-shipping" size={28} color={COLORS.primary} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Agende sua coleta</Text>
          <Text style={styles.cardDesc}>Escolha levar até o ponto ou agendar a retirada com nossos parceiros logísticos.</Text>
        </View>
      </View>

     {/* Feature Card (Simples) */}
      <View style={styles.card}>
        <View style={styles.cardIconWrap}>
         <MaterialIcons name="star-outline" size={28} color={COLORS.primary} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Ganhe recompensas</Text>
          <Text style={styles.cardDesc}>
            Transforme seu compromisso com o planeta em benefícios reais.
            Acumule créditos a cada descarte consciente e troque por descontos,
            produtos e serviços de parceiros sustentáveis.</Text>
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
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cardIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "rgba(78, 222, 163, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: "Manrope-Bold",
    fontSize: 16,
    color: COLORS.onSurface,
  },
  cardDesc: {
    fontFamily: "Manrope-Regular",
    fontSize: 13,
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
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
