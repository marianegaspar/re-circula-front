import {
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppFonts } from "../../../hooks/use-App-Fonts";
import { auth, db } from "../../../src/services/firebase";
import { COLORS } from "../../themes";


type CollectionItem = {
  id: string;
  label: string;
  quantity: number;
  category?: string;
};

const CATEGORY_META: Record<
  string,
  {
    title: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
  }
> = {
  informatica: { title: "Informática", icon: "monitor-cellphone" },
  eletronicos: { title: "Eletrônicos", icon: "cellphone" },
  branca: { title: "Linha Branca", icon: "fridge-outline" },
  climatizacao: { title: "Climatização", icon: "air-conditioner" },
  outros: { title: "Itens Variados", icon: "archive-outline" },
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

export default function ColectRevision() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    selectedItems?: string;
    date?: string;
    time?: string;
  }>();
  const { fontsLoaded } = useAppFonts();

  const collectionItems: CollectionItem[] = React.useMemo(() => {
    try {
      return params.selectedItems ? JSON.parse(params.selectedItems) : [];
    } catch {
      return [];
    }
  }, [params.selectedItems]);

  const groupedItems = React.useMemo(() => {
    return collectionItems.reduce<Record<string, CollectionItem[]>>((acc, item) => {
      const category = item.category || "outros";

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(item);
      return acc;
    }, {});
  }, [collectionItems]);

  const totalItems = collectionItems.reduce((sum, item) => sum + item.quantity, 0);
  const impactKg = (totalItems * 0.6).toFixed(1);
  const ecoPoints = totalItems * 112 + 2;

  if (!fontsLoaded) return null;

async function handleConfirmCollection() {

  try {

    const user = auth.currentUser;


  console.log("USER:", user);
  console.log("ITEMS:", collectionItems);
  console.log("PARAMS:", params);

    if (!user) {
      return;
    }

    await addDoc(
      collection(db, "schedules"),
      {
        userId: user.uid,
        userName: user.displayName || "",
        userEmail: user.email || "",

        items: collectionItems,

        date: params.date || "",
        time: params.time || "",

        totalItems,
        ecoPoints,
        impactKg,

        status: "pending",

        createdAt: new Date(),
      }
    );

    // AQUI ELE NAVEGA
    router.push({
      pathname: "/colect/confirmation",
      params: {
        selectedItems: JSON.stringify(collectionItems),
        date: params.date || "",
        time: params.time || "",
      },
    });

  } catch (error) {

    console.log("ERRO AO SALVAR:", error);

  }
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
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Data</Text>
          </View>

          <View style={styles.stepWrapper}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={styles.stepDotTextActive}>3</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Confirma</Text>
          </View>
        </View>

        <Text style={styles.title}>Revisão do Pedido</Text>
        <Text style={styles.subtitle}>
          Quase lá. Verifique os detalhes da sua coleta digital e confirme o
          circuito de reciclagem.
        </Text>

        <View style={styles.panel}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View style={styles.sectionIconBox}>
                  <MaterialIcons
                    name="inventory-2"
                    size={18}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.sectionTitle}>Itens Selecionados</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/colect/itens",
                    params: { selectedItems: JSON.stringify(collectionItems) },
                  })
                }
              >
                <Text style={styles.editText}>EDITAR</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.itemsGroup}>
              {Object.entries(groupedItems).map(([category, items]) => {
                const meta = CATEGORY_META[category] || CATEGORY_META.outros;
                const categoryTotal = items.reduce((sum, item) => sum + item.quantity, 0);
                const summaryLabel =
                  items.length > 1 ? `${meta.title} Variados` : items[0]?.label || meta.title;

                return (
                  <View key={category} style={styles.itemSummaryCard}>
                    <View style={styles.itemSummaryLeft}>
                      <View style={styles.itemSummaryIconBox}>
                        <MaterialCommunityIcons
                          name={meta.icon}
                          size={18}
                          color={COLORS.onSurface}
                        />
                      </View>
                      <Text style={styles.itemSummaryLabel}>{summaryLabel}</Text>
                    </View>

                    <Text style={styles.itemSummaryQty}>
                      {categoryTotal} {categoryTotal === 1 ? "item" : "itens"}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.sectionIconBox}>
                <MaterialIcons name="event" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.sectionTitle}>Data e Hora</Text>
            </View>

            <Text style={styles.dateValue}>{formatDate(params.date)}</Text>
            <View style={styles.timeRow}>
              <MaterialIcons name="schedule" size={14} color={COLORS.primary} />
              <Text style={styles.timeValue}> {params.time || "A definir"}</Text>
            </View>
          </View>

          <View style={styles.impactCard}>
            <Text style={styles.impactEyebrow}>ESTIMATIVA DE IMPACTO</Text>

            <View style={styles.impactMetrics}>
              <View>
                <Text style={styles.impactValue}>{impactKg}kg</Text>
                <Text style={styles.impactLabel}>CO2 Evitado</Text>
              </View>

              <View style={styles.pointsBlock}>
                <Text style={styles.pointsValue}>{ecoPoints}</Text>
                <Text style={styles.pointsLabel}>Ecopontos</Text>
              </View>
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipTitle}>Curiosidade:</Text>
              <Text style={styles.tipText}>
                Esta coleta economiza energia equivalente a manter uma lâmpada LED
                ligada por 180 dias.
              </Text>
            </View>
          </View>
        </View>



        <TouchableOpacity
        
    style={styles.confirmButton}
          activeOpacity={0.9}
          onPress={() => handleConfirmCollection()    
            
          }
  
        >
          <Text style={styles.confirmButtonText}>Confirmar Coleta</Text>
          <MaterialIcons name="arrow-forward" size={18} color={COLORS.onPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.9}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>Voltar</Text>
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
    padding: 20,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    marginBottom: 20,
  },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 240,
    alignSelf: "center",
    marginBottom: 28,
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
  panel: {
    
    gap: 16,
    marginBottom: 20,
  },
  sectionCard: {
    backgroundColor: "#243047",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#0d1830",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    color: "#F2F6FF",
    fontFamily: "Manrope-Bold",
    fontSize: 13,
  },
  editText: {
    color: COLORS.primary,
    fontSize: 11,
    fontFamily: "Manrope-Bold",
  },
  itemsGroup: {
    gap: 10,
  },
  itemSummaryCard: {
    backgroundColor: "#162238",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  itemSummaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    paddingRight: 10,
  },
  itemSummaryIconBox: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  itemSummaryLabel: {
    color: "#F2F6FF",
    fontSize: 13,
    fontFamily: "Manrope-Regular",
  },
  itemSummaryQty: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: "Manrope-Bold",
  },
  dateValue: {
    color: "#F2F6FF",
    fontSize: 32,
    lineHeight: 36,
    fontFamily: "Manrope-Bold",
    marginTop: 12,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeValue: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: "Manrope-Regular",
  },
  impactCard: {
    backgroundColor: "#243047",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(78, 222, 163, 0.18)",
  },
  impactEyebrow: {
    color: COLORS.primary,
    fontSize: 10,
    letterSpacing: 1.2,
    fontFamily: "Manrope-Bold",
    marginBottom: 12,
  },
  impactMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  impactValue: {
    color: "#F2F6FF",
    fontSize: 38,
    lineHeight: 40,
    fontFamily: "Manrope-Bold",
  },
  impactLabel: {
    color: COLORS.onSurfaceVariant,
    fontSize: 11,
    fontFamily: "Manrope-Regular",
  },
  pointsBlock: {
    alignItems: "flex-end",
    paddingTop: 8,
  },
  pointsValue: {
    color: COLORS.primary,
    fontSize: 40,
    lineHeight: 42,
    fontFamily: "Manrope-Bold",
  },
  pointsLabel: {
    color: COLORS.onSurfaceVariant,
    fontSize: 11,
    fontFamily: "Manrope-Regular",
  },
  tipBox: {
    backgroundColor: "rgba(78, 222, 163, 0.08)",
    borderRadius: 8,
    padding: 10,
  },
  tipTitle: {
    color: COLORS.primary,
    fontSize: 11,
    fontFamily: "Manrope-Bold",
    marginBottom: 2,
  },
  tipText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Manrope-Regular",
  },
  confirmButton: {
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  confirmButtonText: {
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
    // Content
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 32,
    fontWeight: "800",
    color: "#dae2fd",
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 15,
    color: "#bbcabf",
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 32,
  },
  
});
