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
import QRCode from "react-native-qrcode-svg";
import { useAppFonts } from "../../../hooks/use-App-Fonts";
import { WebContainer } from "../../components/WebContainer";
import { COLORS } from "../../themes";

export default function CollectionPointConfirm() {
  const params = useLocalSearchParams<{
    id?: string;
    scheduleId?: string;
    validationCode?: string;
  }>();
  const router = useRouter();
  const { fontsLoaded } = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <WebContainer style={styles.container}>
        <View style={styles.successBadge}>
          <View style={styles.successInner}>
            <MaterialIcons
              name="qr-code"
              size={36}
              color={COLORS.onPrimary}
            />
          </View>
        </View>

        <Text style={styles.title}>Entrega registrada!</Text>
        <Text style={styles.subtitle}>
          Apresente este código no ponto de coleta. Os ecopontos serão liberados
          depois que a entrega for validada.
        </Text>

        {params.validationCode ? (
          <View style={styles.validationCard}>
            <Text style={styles.validationEyebrow}>CÓDIGO DE VALIDAÇÃO</Text>

            <View style={styles.qrCodeBox}>
              <QRCode
                value={params.validationCode}
                size={168}
                color="#0B1326"
                backgroundColor="#FFFFFF"
              />
            </View>

            <Text selectable style={styles.validationCode}>
              {params.validationCode}
            </Text>
            <Text style={styles.validationDescription}>
              Este QR Code representa o mesmo código acima. Não é necessário
              utilizar a câmera nesta demonstração.
            </Text>
          </View>
        ) : null}

        <View style={styles.pointsCard}>
          <Text style={styles.pointsTitle}>Recompensa pendente</Text>
          <Text style={styles.pointsValue}>+50 Ecopontos</Text>
          <Text style={styles.pointsDescription}>
            A pontuação será adicionada uma única vez após a confirmação.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: "/confirm-delivery",
              params: {
                scheduleId: params.scheduleId || "",
                validationCode: params.validationCode || "",
              },
            })
          }
        >
          <Text style={styles.primaryButtonText}>Validar entrega</Text>
          <MaterialIcons
            name="verified"
            size={18}
            color={COLORS.onPrimary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.9}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.secondaryButtonText}>Validar mais tarde</Text>
        </TouchableOpacity>
      </WebContainer>
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
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  successBadge: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(16, 185, 129, 0.18)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    marginTop: 20,
  },
  successInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 30,
    color: COLORS.onSurface,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 15,
    color: COLORS.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: "center",
  },
  validationCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(78, 222, 163, 0.24)",
    marginBottom: 18,
  },
  validationEyebrow: {
    color: COLORS.primary,
    fontSize: 10,
    letterSpacing: 1.2,
    fontFamily: "Manrope-Bold",
    marginBottom: 16,
  },
  qrCodeBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  validationCode: {
    color: COLORS.primary,
    fontSize: 30,
    letterSpacing: 2,
    fontFamily: "Manrope-Bold",
    marginTop: 16,
  },
  validationDescription: {
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Manrope-Regular",
    textAlign: "center",
    marginTop: 8,
  },
  pointsCard: {
    backgroundColor: COLORS.primary + "15",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    alignItems: "center",
  },
  pointsTitle: {
    fontFamily: "Manrope-Bold",
    fontSize: 13,
    color: COLORS.onSurface,
    marginBottom: 6,
  },
  pointsValue: {
    fontFamily: "Manrope-Bold",
    fontSize: 26,
    color: COLORS.primary,
    marginBottom: 6,
  },
  pointsDescription: {
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.onSurfaceVariant,
    textAlign: "center",
  },
  primaryButton: {
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  primaryButtonText: {
    fontFamily: "Manrope-Bold",
    color: COLORS.onPrimary,
    fontSize: 16,
  },
  secondaryButton: {
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: COLORS.onSurface,
    fontSize: 14,
    fontFamily: "Manrope-Regular",
  },
});
