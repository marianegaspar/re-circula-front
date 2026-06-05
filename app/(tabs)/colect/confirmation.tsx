import {
  MaterialIcons
} from "@expo/vector-icons";
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

type CollectionItem = {
  id: string;
  label: string;
  quantity: number;
  category?: string;
};

function formatDate(date?: string) {
  if (!date) return "Data não informada";

  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;

  const monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return `${day} ${monthNames[Number(month) - 1]}, ${year}`;
}

export default function CollectConfirmation() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    selectedItems?: string;
    deliveryType?: string;
    date?: string;
    time?: string;
    pointName?: string;
    pointAddress?: string;
    pointHours?: string;
  }>();
  const { fontsLoaded } = useAppFonts();

  const collectionItems: CollectionItem[] = React.useMemo(() => {
    try {
      return params.selectedItems ? JSON.parse(params.selectedItems) : [];
    } catch {
      return [];
    }
  }, [params.selectedItems]);

  const totalItems = collectionItems.reduce((sum, item) => sum + item.quantity, 0);
  const ecoPoints = totalItems * 112 + 2;
  const isDropOff = params.deliveryType === "dropoff";

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
        <View style={styles.successBadge}>
          <View style={styles.successInner}>
            <MaterialIcons name="check" size={34} color={COLORS.onPrimary} />
          </View>
        </View>

        <Text style={styles.title}>
          {isDropOff ? "Entrega Confirmada!" : "Coleta Agendada!"}
        </Text>
        <Text style={styles.subtitle}>
          {isDropOff
            ? "O circuito de reciclagem começou. Leve seus itens ao ponto físico escolhido."
            : "O circuito de reciclagem começou. Prepare seus itens e aguarde o nosso agente."}
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.infoBlock}>
            <View style={styles.infoIconBox}>
              <MaterialIcons
                name={isDropOff ? "location-on" : "event"}
                size={18}
                color={COLORS.primary}
              />
            </View>
            <View>
              <Text style={styles.infoLabel}>
                {isDropOff ? "PONTO DE ENTREGA" : "DATA DA COLETA"}
              </Text>
              <Text style={styles.infoValue}>
                {isDropOff ? params.pointName || "Ponto físico" : formatDate(params.date)}
              </Text>
              {isDropOff ? (
                <Text style={styles.infoDescription}>
                  {params.pointAddress || "Endereço não informado"}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.infoBlock}>
            <View style={styles.infoIconBox}>
              <MaterialIcons name="schedule" size={18} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>
                {isDropOff ? "HORÁRIO DO PONTO" : "JANELA DE HORÁRIO"}
              </Text>
              <Text style={styles.infoValue}>
                {isDropOff ? params.pointHours || "A definir" : params.time || "A definir"}
              </Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.rewardRow}>
            <View>
              <Text style={styles.rewardLabel}>Recompensa Estimada</Text>
            </View>

            <View style={styles.pointsPill}>
              <Text style={styles.pointsPillValue}>+{ecoPoints}</Text>
              <Text style={styles.pointsPillText}>Ecopontos</Text>
            </View>
          </View>
        </View>

        <Text style={styles.stepsEyebrow}>PRÓXIMOS PASSOS</Text>

        <View style={styles.stepsList}>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>01</Text>
            <Text style={styles.stepText}>
              Prepare os eletrônicos em uma caixa ou sacola
            </Text>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>02</Text>
            <Text style={styles.stepText}>
              {isDropOff
                ? "Leve os itens ao ponto físico dentro do horário de funcionamento"
                : "Certifique-se de que haverá alguém no local"}
            </Text>
          </View>

        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.9}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.primaryButtonText}>Ir para Início</Text>
          <MaterialIcons name="arrow-forward" size={18} color={COLORS.onPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: "/colect/revision",
              params: {
                selectedItems: JSON.stringify(collectionItems),
                deliveryType: isDropOff ? "dropoff" : "pickup",
                date: params.date || "",
                time: params.time || "",
                pointName: params.pointName || "",
                pointAddress: params.pointAddress || "",
                pointHours: params.pointHours || "",
              },
            })
          }
        >
          <Text style={styles.secondaryButtonText}>Ver Detalhes do Pedido</Text>
        </TouchableOpacity>
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
    color: "#F2F6FF",
    fontSize: 24,
    lineHeight: 30,
    fontFamily: "Manrope-Bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Manrope-Regular",
    textAlign: "center",
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: "#243047",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    marginBottom: 18,
    overflow: "hidden",
  },
  infoBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  infoIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#1c2840",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    color: COLORS.onSurfaceVariant,
    fontSize: 9,
    letterSpacing: 1,
    fontFamily: "Manrope-Bold",
    marginBottom: 4,
  },
  infoValue: {
    color: "#F2F6FF",
    fontSize: 20,
    lineHeight: 24,
    fontFamily: "Manrope-Bold",
  },
  infoDescription: {
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Manrope-Regular",
    marginTop: 4,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 4,
  },
  rewardRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rewardLabel: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    fontFamily: "Manrope-Regular",
  },
  pointsPill: {
    backgroundColor: "rgba(16, 185, 129, 0.18)",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 106,
  },
  pointsPillValue: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: "Manrope-Bold",
    textAlign: "center",
  },
  pointsPillText: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: "Manrope-Regular",
    textAlign: "center",
  },
  stepsEyebrow: {
    color: COLORS.onSurfaceVariant,
    fontSize: 10,
    letterSpacing: 1.1,
    fontFamily: "Manrope-Bold",
    marginBottom: 14,
  },
  stepsList: {
    gap: 14,
    marginBottom: 28,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  stepNumber: {
    color: COLORS.primary,
    fontSize: 28,
    lineHeight: 30,
    fontFamily: "Manrope-Bold",
  },
  stepText: {
    flex: 1,
    color: "#F2F6FF",
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Manrope-Regular",
    paddingTop: 4,
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
    color: COLORS.onPrimary,
    fontSize: 15,
    fontFamily: "Manrope-Bold",
  },
  secondaryButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#F2F6FF",
    fontSize: 14,
    fontFamily: "Manrope-Regular",
  },
});
