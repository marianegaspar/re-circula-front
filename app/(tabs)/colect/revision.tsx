import {
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, doc, getDoc, increment, updateDoc } from "firebase/firestore";
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
import { WebContainer } from "../../components/WebContainer";
import { COLORS } from "../../themes";


type CollectionItem = {
  id: string;
  label: string;
  quantity: number;
  category?: string;
};

type Address = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
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

function formatPickupAddress(address: Address | null) {
  if (!address) return "Endereço não cadastrado";

  const streetLine = [address.street, address.number].filter(Boolean).join(", ");
  const neighborhoodLine = [address.neighborhood, address.city, address.state]
    .filter(Boolean)
    .join(" - ");

  return [streetLine, neighborhoodLine, address.cep ? `CEP ${address.cep}` : ""]
    .filter(Boolean)
    .join("\n");
}

export default function ColectRevision() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
    selectedItems?: string;
    deliveryType?: string;
    date?: string;
    time?: string;
    pointId?: string;
    pointName?: string;
    pointAddress?: string;
    pointHours?: string;
  }>();
  const { fontsLoaded } = useAppFonts();
  const [pickupAddress, setPickupAddress] = React.useState<Address | null>(null);

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
  const isDropOff = params.deliveryType === "dropoff";
  const isDetailsMode = params.mode === "details";
  const pickupAddressText = formatPickupAddress(pickupAddress);

  React.useEffect(() => {
    async function loadPickupAddress() {
      const user = auth.currentUser;

      if (!user || isDropOff) {
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const address = userDoc.data()?.address;

      if (address) {
        setPickupAddress({
          cep: address.cep || "",
          street: address.street || "",
          number: address.number || "",
          complement: address.complement || "",
          neighborhood: address.neighborhood || "",
          city: address.city || "",
          state: address.state || "",
        });
      }
    }

    loadPickupAddress();
  }, [isDropOff]);

  if (!fontsLoaded) return null;

async function handleConfirmCollection() {

  try {

    const user = auth.currentUser;

    console.log("[COLETA] USER:", user);
    console.log("[COLETA] ITEMS:", collectionItems);
    console.log("[COLETA] PARAMS:", params);
    console.log("[COLETA] ecoPoints a adicionar:", ecoPoints);

    if (!user) {
      return;
    }

    // 1. CRIAR O AGENDAMENTO
    await addDoc(
      collection(db, "schedules"),
      {
        userId: user.uid,
        userName: user.displayName || "",
        userEmail: user.email || "",

        items: collectionItems,

        deliveryType: isDropOff ? "dropoff" : "pickup",
        date: isDropOff ? "" : params.date || "",
        time: isDropOff ? "" : params.time || "",
        pointId: isDropOff ? params.pointId || "" : "",
        pointName: isDropOff ? params.pointName || "" : "",
        pointAddress: isDropOff ? params.pointAddress || "" : "",
        pointHours: isDropOff ? params.pointHours || "" : "",
        pickupAddress: isDropOff ? null : pickupAddress,

        totalItems,
        ecoPoints,
        impactKg,

        status: "pending",

        createdAt: new Date(),
      }
    );

    console.log("[COLETA] Agendamento criado com sucesso");

    // 2. ATUALIZAR POINTS BALANCE DO USUÁRIO (FONTE ÚNICA DE VERDADE)
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      pointsBalance: increment(ecoPoints),
    });

    console.log("[COLETA] pointsBalance atualizado com +", ecoPoints);

    // AQUI ELE NAVEGA
    router.push({
      pathname: "/colect/confirmation",
      params: {
        selectedItems: JSON.stringify(collectionItems),
        deliveryType: isDropOff ? "dropoff" : "pickup",
        date: params.date || "",
        time: params.time || "",
        pointName: params.pointName || "",
        pointAddress: params.pointAddress || "",
        pointHours: params.pointHours || "",
      },
    });

  } catch (error) {

    console.log("[COLETA] ERRO AO SALVAR:", error);

  }
}

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <WebContainer style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.onSurface} />
        </TouchableOpacity>

        {!isDetailsMode ? (
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
        ) : null}

        <Text style={styles.title}>
          {isDetailsMode ? "Detalhes do Pedido" : "Revisão do Pedido"}
        </Text>
        <Text style={styles.subtitle}>
          {isDetailsMode
            ? "Confira as informações do descarte que já foi confirmado."
            : "Quase lá. Verifique os detalhes do descarte e confirme o circuito de reciclagem."}
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

              {!isDetailsMode ? (
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
              ) : null}
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
                <MaterialIcons
                  name={isDropOff ? "location-on" : "event"}
                  size={18}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.sectionTitle}>
                {isDropOff ? "Local de entrega" : "Data e Hora"}
              </Text>
            </View>

            {isDropOff ? (
              <>
                <Text style={styles.locationValue}>
                  {params.pointName || "Ponto físico"}
                </Text>
                <Text style={styles.locationAddress}>
                  {params.pointAddress || "Endereço não informado"}
                </Text>
                <View style={styles.timeRow}>
                  <MaterialIcons name="schedule" size={14} color={COLORS.primary} />
                  <Text style={styles.timeValue}>
                    {" "}
                    {params.pointHours || "Horário não informado"}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.dateValue}>{formatDate(params.date)}</Text>
                <View style={styles.timeRow}>
                  <MaterialIcons name="schedule" size={14} color={COLORS.primary} />
                  <Text style={styles.timeValue}> {params.time || "A definir"}</Text>
                </View>
              </>
            )}
          </View>

          {!isDropOff && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <View style={styles.sectionIconBox}>
                    <MaterialIcons
                      name="home"
                      size={18}
                      color={COLORS.primary}
                    />
                  </View>
                  <Text style={styles.sectionTitle}>Endereço de coleta</Text>
                </View>

                {!isDetailsMode ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push("/profile")}
                  >
                    <Text style={styles.editText}>EDITAR</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <Text style={styles.addressValue}>{pickupAddressText}</Text>
              {pickupAddress?.complement ? (
                <Text style={styles.addressComplement}>
                  Complemento: {pickupAddress.complement}
                </Text>
              ) : null}
            </View>
          )}

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



        {!isDetailsMode ? (
          <TouchableOpacity
            style={styles.confirmButton}
            activeOpacity={0.9}
            onPress={() => handleConfirmCollection()}
          >
            <Text style={styles.confirmButtonText}>
              {isDropOff ? "Confirmar Entrega" : "Confirmar Coleta"}
            </Text>
            <MaterialIcons name="arrow-forward" size={18} color={COLORS.onPrimary} />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.9}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>Voltar</Text>
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
  locationValue: {
    color: "#F2F6FF",
    fontSize: 24,
    lineHeight: 30,
    fontFamily: "Manrope-Bold",
    marginTop: 12,
    marginBottom: 8,
  },
  locationAddress: {
    color: COLORS.onSurfaceVariant,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Manrope-Regular",
    marginBottom: 10,
  },
  addressValue: {
    color: "#F2F6FF",
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Manrope-Regular",
    marginTop: 2,
  },
  addressComplement: {
    color: COLORS.primary,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Manrope-Regular",
    marginTop: 8,
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
