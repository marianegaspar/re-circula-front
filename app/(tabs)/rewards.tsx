import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  doc, increment, onSnapshot, setDoc
} from "firebase/firestore";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAppFonts } from "../../hooks/use-App-Fonts";
import { auth, db } from "../../src/services/firebase";
import { LevelProgressBar } from "../components/LevelProgressBar";
import { COLORS } from "../themes";
import { getLevel } from "../utils/levels";


export default function Rewards() {
  const { fontsLoaded } = useAppFonts();
   const router = useRouter();
  const user = auth.currentUser;
  const [pointsBalance, setPointsBalance] = React.useState<number>(0);
  const [loadingPoints, setLoadingPoints] = React.useState(true);
  const [redeemedRewards, setRedeemedRewards] = React.useState<Set<string>>(new Set());

  // ✅ FONTE ÚNICA DE VERDADE: users.pointsBalance
  const totalPoints = pointsBalance;

  const rewards = [
    {
      id: "gift-card",
      icon:"🎁",
      title: "Vale Presente",
      description: "Resgate vouchers para suas lojas favoritas.",
      cost: 800,
     
    },
    {
      id: "repair-discount",
      icon:"🎁",
      title: "Desconto Reparo",
      description: "20% off em assistência técnica autorizada.",
      cost: 1200,
      
    },
    {
      id: "ecocloud",
      icon:"🎁",
      title: "EcoCloud",
      description: "Armazenamento em nuvem carbono neutro.",
      cost: 500,
      
    },
  ];

  React.useEffect(() => {
    if (!user) {
      setLoadingPoints(false);
      return;
    }

    console.log("[REWARDS] Iniciando onSnapshot para pointsBalance");

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      const userData = snapshot.data();
      const balance = typeof userData?.pointsBalance === "number" ? userData.pointsBalance : 0;
      console.log("[REWARDS] pointsBalance atualizado:", balance);
      setPointsBalance(balance);
      setLoadingPoints(false);
    });

    return () => {
      console.log("[REWARDS] Limpando onSnapshot");
      unsubscribe();
    };
  }, [user]);

  const handleRedeem = async (cost: number, title: string, rewardId: string) => {
    if (!user) {
      Alert.alert("Atenção", "Faça login para resgatar recompensas.");
      return;
    }

    if (totalPoints < cost) {
      return;
    }

    try {
      console.log("[REWARDS] Iniciando resgate: ", { title, cost, balanceAntes: totalPoints });

      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        { pointsBalance: increment(-cost) },
        { merge: true }
      );

      console.log("[REWARDS] Resgate concluído. Nova balance será atualizada via onSnapshot");
      
      setRedeemedRewards((prev) => new Set(prev).add(rewardId));
      Alert.alert("Resgate realizado", `Você resgatou ${title} por ${cost} pontos.`);
    } catch (error) {
      console.log("[REWARDS] Erro ao realizar resgate:", error);
      Alert.alert("Erro", "Não foi possível concluir o resgate agora.");
    }
  };

  if (!fontsLoaded || loadingPoints) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <View style={styles.header}>
      <Text style={styles.title}>Recompensas</Text>
      <TouchableOpacity onPress={() =>  router.push({
            pathname: "/how-it-works"})}>
            <MaterialIcons
              name="question-mark"
              size={20}
              color={COLORS.
                
                onSurface}
            />
          </TouchableOpacity>
        </View>

     {/* Barra de Progresso de Nível */}
        {pointsBalance !== null && (
          <LevelProgressBar levelInfo={getLevel(pointsBalance)} />
        )}

      <View style={styles.rewardsList}>
        <Text style={styles.rewardHeader}> Disponíveis para você</Text>

        {rewards.map((reward) => {
          const isRedeemed = redeemedRewards.has(reward.id);
          const canRedeem = !isRedeemed && totalPoints >= reward.cost;

          return (
            <View key={reward.id} style={styles.rewardCard}>

              <View style={styles.rewardContent}>
                <View style={styles.rewardContainer}>
                  <View style={styles.rewardIcon}>
                    {reward.icon}
                    
                    </View>
                  <View style={styles.rewardColumn}>
                      <Text style={styles.rewardTitle}>{reward.title}</Text>
                      <Text style={styles.rewardDescription}>{reward.description}</Text>
                  </View>
                </View>
                <View style={styles.rewardFooter}>
                  <Text style={styles.rewardPoints}>⭐  {reward.cost} Pontos</Text>

                  <TouchableOpacity
                    style={[
                      styles.rewardButton,
                      (!canRedeem || isRedeemed) && styles.rewardButtonDisabled,
                    ]}
                    activeOpacity={0.9}
                    disabled={!canRedeem}
                    onPress={() => handleRedeem(reward.cost, reward.title, reward.id)}
                  >
                    {isRedeemed ? (
                      <View style={styles.redeemedButtonContent}>
                        <MaterialIcons name="check" size={18} color={COLORS.onPrimary} />
                        <Text style={[styles.rewardCta, styles.rewardCtaChecked]}>Resgatado</Text>
                      </View>
                    ) : (
                      <Text style={styles.rewardCta}>
                        {canRedeem ? "Resgatar" : "Saldo insuficiente"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },

    header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 24,
    fontWeight: "800", 
    color: COLORS.onSurface,
   
  },

    subtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 18,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
    marginBottom: 24,
  },

  rewardHeader: {
    fontFamily: "Manrope-Bold",
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.onSurface,
    marginBottom: 10,
  },

  rewardsList: {
    flexDirection: "column",
    gap: 15,
  },
  rewardCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 10,
    overflow: "hidden",
  },
  rewardImage: {
    width: "100%",
    height: 120,
  },
  rewardTitle: {
    fontSize: 18,
    fontFamily: "Manrope-Bold",
    color: COLORS.onSurface,
    marginBottom: 10,
  },
  rewardPoints: {
    fontSize: 18,
    fontFamily: "Manrope-Bold",
    color: COLORS.primary,
  },
  rewardDescription: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: COLORS.onSurfaceVariant,
    marginBottom: 10,
  },
  rewardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  rewardButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardButtonDisabled: {
    backgroundColor: COLORS.onSurfaceVariant,
  },
  redeemedButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rewardCta: {
    fontSize: 14 ,
    fontFamily: "Manrope-Bold",
    color: COLORS.background,
  },
  rewardCtaChecked: {
    color: COLORS.onPrimary,
  
  },
  rewardContent: {
    flex:1,
   padding: 12,
  }, 
  rewardContainer:{
    flex:1,
    flexDirection:"row",
    gap:8,

  },
  rewardIcon:{
    borderRadius:16,
    borderWidth:25,
   borderColor: COLORS.primary + "10",
  },
  rewardColumn:{
    flexDirection:"column",
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
});              

