import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppFonts } from "../../hooks/use-App-Fonts";
import { auth, db } from "../../src/services/firebase";
import { LevelProgressBar } from "../components/LevelProgressBar";
import { COLORS } from "../themes";
import { getLevel } from "../utils/levels";


export default function HomeScreen() {
  const router = useRouter();
  const { fontsLoaded } = useAppFonts();
  const user = auth.currentUser;
  const [schedules, setSchedules] = React.useState<any[]>([]);
  const visibleSchedules = schedules.slice(0, 2);

  //const totalPoints = schedules.reduce(
    //(sum, schedule) => sum + Number(schedule.ecoPoints || 0),
    //0
 // );

  const [pointsBalance, setPointsBalance] = React.useState<number | null>(null);

  useEffect(() => {
    async function loadSchedules() {
      if (!user) return;

      const q = query(
        collection(db, "schedules"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSchedules(data);
    }

    loadSchedules();
  }, [user]);

  function formatDate(dateString: string) {
    if (!dateString) return "";

    const [, month, day] = dateString.split("-");

    return `${day}/${month}`;
  }

  function formatScheduleDescription(schedule: any) {
    if (schedule.deliveryType === "dropoff") {
      return `Entrega em ${schedule.pointName || "ponto físico"}`;
    }

    return `Coleta agendada para ${formatDate(schedule.date)} às ${schedule.time}`;
  }

  //para atualizar recompensas
  React.useEffect(() => {
  if (!user) return;

  console.log("[HOME] Iniciando onSnapshot para pointsBalance");

  const userRef = doc(db, "users", user.uid);

  const unsubscribe = onSnapshot(userRef, (snapshot) => {
    const data = snapshot.data();

    if (data) {
      console.log("[HOME] pointsBalance atualizado:", data.pointsBalance || 0);
      setPointsBalance(data.pointsBalance || 0);
    }
  });

  return () => {
    console.log("[HOME] Limpando onSnapshot");
    unsubscribe();
  };
}, [user]);


  if (!fontsLoaded) {
    return null; // O App fica travado na Splash Screen até as fontes estarem prontas
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brand}>
            <MaterialIcons name="bolt" size={28} color={COLORS.primary} />
            <Text style={styles.logoText}> ReCircula </Text>
          </View>
          <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.onSurface}
            />
          </TouchableOpacity>
        </View>

        {/* Welcome */}
        <TouchableOpacity
          style={styles.profileHero}
          activeOpacity={0.85}
          onPress={() => router.push("/profile")}
        >
          <View style={styles.profileAvatar}>
            <MaterialIcons name="person" size={26} color={COLORS.onPrimary} />
          </View>

          <View style={styles.profileHeroText}>
            <Text style={styles.title}>Olá, {user?.displayName}</Text>
            <Text style={styles.subtitle}>
              Vamos dar o destino correto aos seus eletrônicos hoje?
            </Text>
          </View>
        </TouchableOpacity>   
       
        {/* Barra de Progresso de Nível */}
        {pointsBalance !== null && (
          <LevelProgressBar levelInfo={getLevel(pointsBalance)} />
        )}

        <Text style={[styles.title,
          {fontSize: 16, marginBottom: 16}
        ]}>
          O QUE DESEJA FAZER?
          </Text>
   
          <View style={styles.row}>
            {/*Pontos de Coleta*/} 
            <TouchableOpacity
              style={styles.smallCard}
              activeOpacity={0.85}
              onPress={() => router.push("/map/index-map")}
            >
              <View style={styles.cardIconWrap}>
              <Ionicons  
                name="location-outline"
                size={24}
                color={COLORS.tertiary}
              />
              </View>
              <View>
                <Text style={styles.smallCardValue}>Pontos de coleta</Text>
                <Text style={styles.smallCardLabel}>
                  Encontre um local próximo de você
                </Text>
              </View>
            </TouchableOpacity>

              <TouchableOpacity
              style={[styles.smallCard,{
                 borderWidth: 1,
                 borderColor: "#2ecc8a",
              }]}
              activeOpacity={0.85}
              onPress={() => router.push("/colect")}
            >   
            <View style={styles.cardIconWrap}>
              <MaterialCommunityIcons
                name="truck-outline"
                size={36}
                color={COLORS.primary}
              />
              </View>
              
              <View>
                <Text style={styles.smallCardValue}>Agendar coleta</Text>
                <Text style={styles.smallCardLabel}>
                  Solicite a retirada no seu endereço
                </Text>
              </View>
              </TouchableOpacity>
    
          </View>

        {schedules.length > 0 && (
          <>
            {/* Minhas solicitações */}
            <View style={styles.requestsHeader}>
              <Text style={styles.requestsTitle}>Minhas Solicitações</Text>
              <TouchableOpacity>
                {
                /*<Text style={styles.requestsLink}>Ver histórico</Text> */ }
              </TouchableOpacity>
            </View>

            <View style={styles.requestsList}>
              {visibleSchedules.map((schedule) => (
                <TouchableOpacity
                  key={schedule.id}
                  style={styles.requestCard}
                  activeOpacity={0.85}
                >
                  <View style={styles.requestCardLeft}>
                    <View style={styles.requestIconWrap}>
                      <MaterialIcons
                        name={
                          schedule.status === "pending"
                            ? "schedule"
                            : "check-circle"
                        }
                        size={24}
                        color={COLORS.primary}
                      />
                    </View>

                    <View style={styles.requestContent}>
                      <Text style={styles.requestTitle}>
                        {schedule.items?.length > 1
                          ? `${schedule.items.length} itens para coleta`
                          : schedule.items?.[0]?.label || "Coleta"}
                      </Text>

                      <Text style={styles.requestSubtitle}>
                        {formatScheduleDescription(schedule)}
                      </Text>

                      <View style={styles.requestStatusPill}>
                        <Text style={styles.requestStatusText}>
                          {schedule.status === "pending"
                            ? "EM PROCESSAMENTO"
                            : "CONCLUÍDO"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        <Text style={styles.title}>Centro de Aprendizado</Text>


        <View style={styles.infoSection}>

          <Image source={require("../../assets/images/ewaste.webp")}
          style={{ width: "100%", height: 120, borderRadius: 8 }}  />

          <View style={styles.infoContent}>
            <Text style={styles.requestTitle}>O que é lixo eletrônico?</Text>
            <Text style={styles.requestSubtitle}>
              Entenda a composição dos dispositvos descartados.
              
            </Text>
            </View>
          </View>
        </View>

        

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {

    backgroundColor: COLORS.background,
    padding: 20,
  },

  scrollContent: {
    flex:1,
  },

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
  profileHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  profileHeroText: {
    flex: 1,
  },

  bentoGrid: { gap: 16, marginBottom: 16 },
  summaryCard: {
    backgroundColor: COLORS.primaryContainer,
    borderRadius: 24,
    padding: 20,
    minHeight: 156,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "stretch",
  },
  summaryColumn: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
    zIndex: 2,
  },
  summaryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  summaryValue: {
    fontFamily: "Manrope-Bold",
    fontSize: 38,
    color: COLORS.onPrimary,
  },
  summaryLabel: {
    color: COLORS.onPrimary,
    fontSize: 13,
    fontFamily: "Manrope-Bold",
    lineHeight: 18,
    marginTop: 4,
  },
  summaryBgIcon: { position: "absolute", bottom: -20, right: -8 },

  row: { flexDirection: "row", gap: 16, marginBottom: 16 },
  smallCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainer,
    
  
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
    minHeight: 180,
   
    
  },
  smallCardValue: { fontSize: 20, color: COLORS.onSurface },
  smallCardLabel: {
    fontSize: 12,
    fontFamily: "Manrope-ExtraBold",
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: 4,
  },

  cardIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(78, 222, 163, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12, // Dá um espacinho entre a bolinha e o texto abaixo
  },

  collectCard: { gap: 16, marginBottom: 16 },
  collectCardContent: {
    backgroundColor: COLORS.tertiary,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.outline + "10",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  labelTitle: {
    fontSize: 20,
    color: COLORS.onPrimary,
    letterSpacing: 1,
    fontWeight: "700",
    fontFamily: "Manrope-ExtraBold",
  },
  labelDescription: {
    color: COLORS.onPrimary + "cc",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    marginTop: 8,
    lineHeight: 16,
  },
  requestsHeader: {
    marginTop: 24,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  requestsTitle: {
    fontFamily: "Manrope-Bold",
    fontSize: 20,
    color: COLORS.onSurface,
  },
  requestsLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: "Manrope-Bold",
  },
  requestsList: {
    gap: 16,
  },
  infoSection:{
      backgroundColor: COLORS.surfaceContainer,
    borderRadius: 10,

  },
  infoContent: {
     padding: 16,
  },
  requestCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.outline + "10",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  requestCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
    paddingRight: 12,
  },
  requestIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(78, 222, 163, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  requestContent: {
    flex: 1,
  },
  requestTitle: {
    color: COLORS.onSurface,
    fontSize: 18,
    fontFamily: "Manrope-Bold",
    marginBottom: 4,
  },
  requestSubtitle: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Manrope-Regular",
    paddingBottom: 8,

  },
  requestStatusPill: {
    backgroundColor: "rgba(16, 185, 129, 0.22)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  requestStatusText: {
    color: "#9AE6C2",
    fontSize: 12,
    fontFamily: "Manrope-Bold",
  },

  seeAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },

  seeAllText: {
    color: COLORS.outline,
    fontWeight: "600",
  },

  mapContainer: {
    height: 240,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
  },
  map: { flex: 1 },

  collectionList: {
    gap: 12,
    marginBottom: 24,
  },

  collectionItem: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  collectionIcon: {
    height: 50,
    width: 50,
    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",
  },

  collectionTitle: {
    fontFamily: "Manrope-Bold",
    color: COLORS.onSurface,
  },

  collectionDistance: {
    marginTop: 4,
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
  },
});
