import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppFonts } from "../../hooks/use-App-Fonts";
import { auth } from "../../src/services/firebase";
import { COLORS } from "../themes";
import { awardDeliveryPoints, hasBeenAwarded } from "../utils/rewards";
import { COLLECTION_POINTS } from "./collection-points";

export default function CollectionPointConfirm() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { fontsLoaded } = useAppFonts();
  const user = auth.currentUser;
  const [isAwardingPoints, setIsAwardingPoints] = React.useState(false);

  const point = React.useMemo(
    () => COLLECTION_POINTS.find((item) => item.id === id),
    [id]
  );

  const handleAwardPoints = async (destination: string) => {
    if (!user) {
      Alert.alert("Atenção", "Usuário não autenticado.");
      return;
    }

    if (!id) {
      Alert.alert("Erro", "ID do ponto de coleta não encontrado.");
      return;
    }

    try {
      setIsAwardingPoints(true);
      
      console.log("[COLLECTION-CONFIRM] Verificando se entrega já foi recompensada");

      // Verifica se já foi recompensado
      const alreadyAwarded = await hasBeenAwarded(String(id), user.uid);
      
      if (alreadyAwarded) {
        console.warn("[COLLECTION-CONFIRM] Entrega já foi recompensada");
        Alert.alert(
          "Entrega já confirmada",
          "Os pontos dessa entrega já foram creditados à sua conta."
        );
        if (destination === "home") {
          router.replace("/home");
        } else {
          router.push("/rewards");
        }
        return;
      }

      console.log("[COLLECTION-CONFIRM] Iniciando award de 50 pontos");

      // Adiciona os pontos com proteção
      const success = await awardDeliveryPoints(String(id), user.uid, 50);

      if (success) {
        console.log("[COLLECTION-CONFIRM] 50 pontos adicionados com sucesso");
        Alert.alert("Sucesso!", "50 ecopontos foram creditados à sua conta.");
      } else {
        console.warn("[COLLECTION-CONFIRM] Award falhou");
        Alert.alert("Atenção", "A entrega já foi recompensada.");
      }

      if (destination === "home") {
        router.replace("/home");
      } else {
        router.push("/rewards");
      }
    } catch (error) {
      console.log("[COLLECTION-CONFIRM] Erro ao adicionar pontos:", error);
      Alert.alert("Erro", "Não foi possível confirmar a entrega agora. Tente novamente.");
    } finally {
      setIsAwardingPoints(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
          <View style={styles.successBadge}>
                  <View style={styles.successInner}>
                    <MaterialIcons name="check" size={34} color={COLORS.onPrimary} />
                  </View>
                        </View>
       
        <Text style={styles.title}>Entrega {"\n"} Confirmada!</Text>
        <Text style={styles.subtitle}>
          Obrigado por entregar no ponto parceiro. Seus ecopontos serão creditados em breve.
        </Text>

        <View style={styles.pointsCard}>
          <Text style={styles.pointsTitle}>Recompensa Estimada</Text>
          <Text style={styles.pointsValue}>+50 Ecopontos</Text>
          <Text style={styles.pointsDescription}>
            Mantenha a entrega organizada para assegurar a pontuação.
          </Text>
        </View>

       { /* Impacto Ambiental */}

          <View style={styles.row}>
              <View style={styles.smallCard}>
                   <MaterialIcons
                              name="opacity"
                              size={60}
                              color="#4FA3E8"
                             
                            />

                <Text style={styles.smallCardValue}>250 L</Text>
                <Text style={styles.smallCardLabel}>
                  ÁGUA PRESERVADA
                </Text>
              </View>
       
              
              <View style={styles.smallCard}>
                       <MaterialIcons
                              name="eco"
                              size={60}
                              color={COLORS.primary}
                             
                            />

                <Text style={styles.smallCardValue}>2.4 g</Text>
                <Text style={styles.smallCardLabel}>
                  C02 REDUZIDO
                </Text>
              </View>
            
        
          </View>



       {/*Botoes final*/}

            <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.9}
                onPress={() => handleAwardPoints("home")}
                disabled={isAwardingPoints}
              >
                <Text style={styles.primaryButtonText}>{isAwardingPoints ? "Processando..." : "Ir para Início"}</Text>
                <MaterialIcons name="arrow-forward" size={18} color={COLORS.onPrimary} />
              </TouchableOpacity>
      
        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.9}
          onPress={() => handleAwardPoints("rewards")}
          disabled={isAwardingPoints}
        >
          <Text style={styles.secondaryButtonText}>{isAwardingPoints ? "Processando..." : "Consultar saldo de pontos"}</Text>
        </TouchableOpacity>
   </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    width: 102,
    height: 102,
    borderRadius: 56,
    backgroundColor: "rgba(16, 185, 129, 0.18)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    marginTop:20,
  },
  successInner: {
    width: 74,
    height: 74,
    borderRadius: 42,
    backgroundColor: COLORS.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 32,
    color: COLORS.onSurface,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Manrope-Bold",
    fontSize: 16,
    color: COLORS.onSurface,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontFamily: "Manrope-Regular",
    fontSize: 14,
    color: COLORS.onSurface,
    flex: 1,
  },
  pointsCard: {
    backgroundColor: COLORS.primary + "15",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    textAlign:"center",
  },
  pointsTitle: {
    fontFamily: "Manrope-Bold",
    fontSize: 14,
    color: COLORS.onSurface,
    marginBottom: 6,
    textAlign:"center",
  },
  pointsValue: {
    fontFamily: "Manrope-Bold",
    fontSize: 28,
    color: COLORS.primary,
    marginBottom: 6,
    textAlign:"center",
  },
  pointsDescription: {
    fontFamily: "Manrope-Regular",
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    
  },
  stepsLabel: {
    fontFamily: "Manrope-Bold",
    fontSize: 14,
    color: COLORS.onSurface,
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  stepNumber: {
    fontFamily: "Manrope-Bold",
    fontSize: 16,
    color: COLORS.primary,
    minWidth: 24,
  },
  stepText: {
    flex: 1,
    fontFamily: "Manrope-Regular",
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    lineHeight: 20,
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
    row: { flexDirection: "row", gap: 16, marginBottom: 16 },

    smallCardValue: { fontSize: 20, color: COLORS.onSurface },
  smallCardLabel: {
    fontSize: 12,
    fontFamily: "Manrope-ExtraBold",
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1,
    marginBottom: 4,
  },

    smallCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainer,
    padding:16,
    }
});

