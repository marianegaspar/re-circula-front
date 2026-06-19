import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../../src/services/firebase";
import { WebContainer } from "../../components/WebContainer";
import { COLORS } from "../../themes";
import { generateUniqueValidationCode } from "../../utils/validation-code";
import { COLLECTION_POINTS } from "./index-map";

export default function CollectionPointDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const point = COLLECTION_POINTS.find((item) => item.id === id);
  const [isCreatingDelivery, setIsCreatingDelivery] = React.useState(false);

  async function handleCreateDelivery() {
    const user = auth.currentUser;

    if (!user || !point) {
      Alert.alert("Atenção", "Faça login para registrar a entrega.");
      return;
    }

    setIsCreatingDelivery(true);

    try {
      const validationCode = await generateUniqueValidationCode();
      const deliveryRef = await addDoc(collection(db, "schedules"), {
        userId: user.uid,
        userName: user.displayName || "",
        userEmail: user.email || "",
        deliveryType: "collection_point",
        collectionPointId: point.id,
        pointName: point.title,
        pointAddress: point.adress,
        pointHours: point.openingHours,
        ecoPoints: 50,
        status: "pending",
        validationCode,
        pointsGranted: false,
        createdAt: serverTimestamp(),
      });

      router.push({
        pathname: "/(tabs)/map/confirm",
        params: {
          id: point.id,
          scheduleId: deliveryRef.id,
          validationCode,
        },
      });
    } catch (error) {
      console.error("[COLLECTION-POINT] Erro ao registrar entrega:", error);
      Alert.alert(
        "Erro",
        "Não foi possível gerar o código da entrega. Tente novamente.",
      );
    } finally {
      setIsCreatingDelivery(false);
    }
  }

  if (!point) {
    return <Text>Ecoponto não encontrado</Text>;
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <WebContainer>
        <View style={styles.wrapper}>
          <Image
            source={point.image}
            style={[styles.collectionImage, { opacity: 0.5 }]}
          />

          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.push("/map")}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.onSurface} />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <Text style={styles.collectionTitle}>{point.title}</Text>

        <View style={styles.infoRow}>
          <MaterialIcons
            name={point.icon as keyof typeof MaterialIcons.glyphMap}
            size={24}
            color={COLORS.primary}
          />
          <Text style={styles.collectionDistance}>{point.adress}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="schedule" size={24} color={COLORS.primary} />
          <Text style={styles.collectionDistance}>{point.openingHours}</Text>
        </View>

        <Text style={styles.collectionTitle2}>Itens Aceitos</Text>
        <View style={styles.tagsContainer}>
          {point.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.rewardCard}>
          <View style={styles.rewardIcon}>
            <MaterialIcons name="emoji-events" size={20} color={COLORS.primary} />
          </View>

          <View style={styles.rewardContent}>
            <Text style={styles.rewardTitle}>Ganhe pontos neste ecoponto</Text>
            <Text style={styles.rewardDescription}>Confirme a entrega para pontuar</Text>
          </View>

          <Text style={styles.rewardPoints}>+50{"\n"}pts</Text>
        </View>

        <View style={[styles.rewardCard, { backgroundColor: COLORS.onSurface + "15" }]}> 
          <View style={styles.rewardContent}>
            <Text style={[styles.rewardTitle, { marginBottom: 12 }]}>Instruções de Descarte</Text>
            <Text style={[styles.rewardDescription, { marginBottom: 12 }]}>• Verifique quais materiais podem ser entregues neste ponto.</Text>
            <Text style={[styles.rewardDescription, { marginBottom: 12 }]}>• Consulte o horário de funcionamento antes de sair.</Text>
            <Text style={styles.rewardDescription}>• Separe os resíduos por tipo para facilitar o descarte.</Text>
          </View>
        </View>

        <View style={[styles.rewardCard, { backgroundColor: COLORS.onSurface + "15" }]}> 
          <View style={styles.rewardContent}>
            <Text style={styles.rewardTitle}>Já está no local?</Text>
            <Text style={[styles.rewardDescription, { marginBottom: 16 }]}>Confirme sua chegada e ganhe seus pontos</Text>
            <TouchableOpacity
              style={styles.btnPrincipal}
              activeOpacity={0.9}
              disabled={isCreatingDelivery}
              onPress={handleCreateDelivery}
            >
              {isCreatingDelivery ? (
                <ActivityIndicator color={COLORS.onPrimary} />
              ) : (
                <Text style={styles.btnPrincipalTexto}>Gerar código da entrega</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnSecondary}
              activeOpacity={0.9}
              disabled={isCreatingDelivery}
              onPress={() => router.push("/confirm-delivery")}
            >
              <Text style={styles.btnSecondaryText}>Já tenho um código</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
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
  },
  wrapper:{
    position: "relative",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
   backButton: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceContainer,
    marginVertical: 12,
    marginLeft:12,
  },

    collectionImage: {
  width: "100%",
  height: 280,
},
  collectionTitle: {
    fontFamily: "Manrope-Bold",
    color: COLORS.onSurface,
    fontSize: 20,  
  },
    collectionTitle2: {
    fontFamily: "Manrope-Bold",
    color: COLORS.onSurface,
    fontSize: 16, 
    marginVertical: 12, 
  },

    collectionDistance: {
    marginTop: 4,
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
   
  },
  tag: {
  backgroundColor: COLORS.primary + "15",
  borderWidth: 1,
  borderColor: COLORS.primary + "30",
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 999,
},

tagText: {
  fontSize: 12,
  color: COLORS.primary,
  fontFamily: "Manrope-Bold",
},
infoRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 8,
  marginTop: 8,
},
rewardCard: {
    width: "100%",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#0A2430",
  borderWidth: 1,
  borderColor: "rgba(0,255,170,0.15)",
  borderRadius: 16,
  padding: 16,
  marginTop: 20,
  
},

rewardIcon: {
  width: 40,
  height: 40,
  borderRadius: 12,
  backgroundColor: "rgba(0,255,170,0.08)",
  justifyContent: "center",
  alignItems: "center",
},

rewardContent: {
  flex: 1,
  marginLeft: 12,
},

rewardTitle: {
  color: "#FFFFFF",
  fontSize: 15,
  fontFamily: "Manrope-Bold",
},

rewardDescription: {
  color: "#8FA3B8",
  fontSize: 14,
  marginTop: 2,
  fontFamily: "Manrope-Regular",
},

rewardPoints: {
  color: COLORS.primary,
  fontSize: 20,
  fontFamily: "Manrope-Bold",
  textAlign: "right",
  marginLeft: 20,
},
  btnPrincipal: {
    width: "100%",
    maxWidth: 340,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  btnPrincipalTexto: {
    color: "#003824",
    fontSize: 16,
    fontWeight: "700",
  },
  btnSecondary: {
    width: "100%",
    maxWidth: 340,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btnSecondaryText: {
    color: COLORS.onSurface,
    fontSize: 14,
    fontFamily: "Manrope-Regular",
  },
  
});
