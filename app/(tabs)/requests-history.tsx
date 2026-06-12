import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppFonts } from "../../hooks/use-App-Fonts";
import { auth, db } from "../../src/services/firebase";
import { WebContainer } from "../components/WebContainer";
import { COLORS } from "../themes";

type CollectionItem = {
  id?: string;
  label?: string;
  quantity?: number;
  category?: string;
};

type Schedule = {
  id: string;
  items?: CollectionItem[];
  deliveryType?: string;
  date?: string;
  time?: string;
  pointName?: string;
  pointAddress?: string;
  pointHours?: string;
  totalItems?: number;
  ecoPoints?: number;
  impactKg?: string | number;
  status?: string;
  createdAt?: any;
};

function formatDate(dateString?: string) {
  if (!dateString) return "Data não informada";

  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;

  return `${day}/${month}/${year}`;
}

function formatCreatedAt(createdAt: Schedule["createdAt"]) {
  const date =
    typeof createdAt?.toDate === "function" ? createdAt.toDate() : null;

  if (!date) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getCreatedAtMs(schedule: Schedule) {
  if (typeof schedule.createdAt?.toMillis === "function") {
    return schedule.createdAt.toMillis();
  }

  if (typeof schedule.createdAt?.toDate === "function") {
    return schedule.createdAt.toDate().getTime();
  }

  return 0;
}

function getStatusLabel(status?: string) {
  return status === "pending" ? "EM PROCESSAMENTO" : "CONCLUÍDO";
}

function getScheduleTitle(schedule: Schedule) {
  const totalItems =
    schedule.totalItems ||
    schedule.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) ||
    0;

  if (totalItems > 1) return `${totalItems} itens para descarte`;

  return schedule.items?.[0]?.label || "Solicitação de descarte";
}

function getScheduleDescription(schedule: Schedule) {
  if (schedule.deliveryType === "dropoff") {
    return `Entrega em ${schedule.pointName || "ponto físico"}`;
  }

  return `Coleta agendada para ${formatDate(schedule.date)} às ${
    schedule.time || "horário não informado"
  }`;
}

export default function RequestsHistoryScreen() {
  const router = useRouter();
  const { fontsLoaded } = useAppFonts();
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadSchedules() {
      const user = auth.currentUser;

      if (!user) {
        setSchedules([]);
        setIsLoading(false);
        return;
      }

      const schedulesQuery = query(
        collection(db, "schedules"),
        where("userId", "==", user.uid),
      );

      const snapshot = await getDocs(schedulesQuery);
      const data = snapshot.docs.map((scheduleDoc) => ({
        id: scheduleDoc.id,
        ...scheduleDoc.data(),
      })) as Schedule[];

      setSchedules(data.sort((a, b) => getCreatedAtMs(b) - getCreatedAtMs(a)));
      setIsLoading(false);
    }

    loadSchedules();
  }, []);

  if (!fontsLoaded) return null;

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

        <Text style={styles.title}>Histórico de Solicitações</Text>
        <Text style={styles.subtitle}>
          Acompanhe suas coletas e entregas confirmadas.
        </Text>

        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={COLORS.primary} />
            <Text style={styles.loadingText}>Carregando histórico...</Text>
          </View>
        ) : schedules.length === 0 ? (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={34}
              color={COLORS.primary}
            />
            <Text style={styles.emptyTitle}>Nenhuma solicitação ainda</Text>
            <Text style={styles.emptyText}>
              Quando você confirmar uma coleta ou entrega, ela aparecerá aqui.
            </Text>
          </View>
        ) : (
          <View style={styles.requestsList}>
            {schedules.map((schedule) => {
              const isDropOff = schedule.deliveryType === "dropoff";
              const createdAt = formatCreatedAt(schedule.createdAt);

              return (
                <View key={schedule.id} style={styles.requestCard}>
                  <View style={styles.requestHeader}>
                    <View style={styles.requestIconWrap}>
                      <MaterialIcons
                        name={isDropOff ? "location-on" : "local-shipping"}
                        size={24}
                        color={COLORS.primary}
                      />
                    </View>

                    <View style={styles.requestHeaderText}>
                      <Text style={styles.requestTitle}>
                        {getScheduleTitle(schedule)}
                      </Text>
                      <Text style={styles.requestSubtitle}>
                        {getScheduleDescription(schedule)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statusRow}>
                    <View style={styles.requestStatusPill}>
                      <Text style={styles.requestStatusText}>
                        {getStatusLabel(schedule.status)}
                      </Text>
                    </View>

                    {createdAt ? (
                      <Text style={styles.createdAt}>Criado em {createdAt}</Text>
                    ) : null}
                  </View>

                  <View style={styles.infoGrid}>
                    <View style={styles.infoBlock}>
                      <Text style={styles.infoLabel}>
                        {isDropOff ? "PONTO DE ENTREGA" : "DATA"}
                      </Text>
                      <Text style={styles.infoValue}>
                        {isDropOff
                          ? schedule.pointName || "Ponto físico"
                          : formatDate(schedule.date)}
                      </Text>
                    </View>

                    <View style={styles.infoBlock}>
                      <Text style={styles.infoLabel}>
                        {isDropOff ? "HORÁRIO" : "JANELA"}
                      </Text>
                      <Text style={styles.infoValue}>
                        {isDropOff
                          ? schedule.pointHours || "Não informado"
                          : schedule.time || "Não informado"}
                      </Text>
                    </View>
                  </View>

                  {isDropOff && schedule.pointAddress ? (
                    <Text style={styles.address}>{schedule.pointAddress}</Text>
                  ) : null}

                  {schedule.items?.length ? (
                    <View style={styles.itemsList}>
                      {schedule.items.map((item, index) => (
                        <View
                          key={`${item.id || item.label || "item"}-${index}`}
                          style={styles.itemRow}
                        >
                          <Text style={styles.itemLabel}>
                            {item.label || "Item selecionado"}
                          </Text>
                          <Text style={styles.itemQuantity}>
                            {Number(item.quantity || 0)}x
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}

                  <View style={styles.rewardRow}>
                    <View>
                      <Text style={styles.rewardLabel}>Impacto estimado</Text>
                      <Text style={styles.rewardValue}>
                        {schedule.impactKg || "0"}kg de CO2 evitado
                      </Text>
                    </View>

                    <View style={styles.pointsPill}>
                      <Text style={styles.pointsValue}>
                        +{schedule.ecoPoints || 0}
                      </Text>
                      <Text style={styles.pointsLabel}>Ecopontos</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
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
    padding: 20,
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
  title: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 38,
  },
  subtitle: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 22,
  },
  loadingBox: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 44,
  },
  loadingText: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 14,
  },
  emptyCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  emptyTitle: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 18,
    marginTop: 14,
  },
  emptyText: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
  },
  requestsList: {
    gap: 16,
  },
  requestCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  requestHeader: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  requestIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(78, 222, 163, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  requestHeaderText: {
    flex: 1,
  },
  requestTitle: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 17,
    marginBottom: 4,
  },
  requestSubtitle: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 13,
    lineHeight: 19,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 16,
  },
  requestStatusPill: {
    backgroundColor: "rgba(16, 185, 129, 0.22)",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  requestStatusText: {
    color: "#9AE6C2",
    fontSize: 11,
    fontFamily: "Manrope-Bold",
  },
  createdAt: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 12,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  infoBlock: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 14,
    padding: 12,
  },
  infoLabel: {
    color: COLORS.primary,
    fontFamily: "Manrope-Bold",
    fontSize: 10,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  infoValue: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 13,
    lineHeight: 18,
  },
  address: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
  },
  itemsList: {
    gap: 8,
    marginTop: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  itemLabel: {
    flex: 1,
    color: COLORS.onSurface,
    fontFamily: "Manrope-Regular",
    fontSize: 13,
  },
  itemQuantity: {
    color: COLORS.primary,
    fontFamily: "Manrope-Bold",
    fontSize: 13,
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
  },
  rewardLabel: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    marginBottom: 4,
  },
  rewardValue: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 14,
  },
  pointsPill: {
    backgroundColor: COLORS.primaryContainer,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  pointsValue: {
    color: COLORS.onPrimary,
    fontFamily: "Manrope-Bold",
    fontSize: 16,
  },
  pointsLabel: {
    color: COLORS.onPrimary,
    fontFamily: "Manrope-Bold",
    fontSize: 10,
  },
});
