import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../themes";
import { COLLECTION_POINTS } from "./collection-points";

export default function CollectionPointDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const point = COLLECTION_POINTS.find((item) => item.id === id);

  if (!point) {
    return <Text>Ecoponto não encontrado</Text>;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.wrapper}>
        <Image
          source={point.image}
          style={[styles.collectionImage, { opacity: 0.5 }]}
        />

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => router.push("/collection-points")}
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
              onPress={() =>
                router.push({
                  pathname: "/collection-points-confirm",
                  params: { id: point.id },
                })
              }
            >
              <Text style={styles.btnPrincipalTexto}>Confirmar Entrega</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  
});

