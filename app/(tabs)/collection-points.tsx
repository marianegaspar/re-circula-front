import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppFonts } from "../../hooks/use-App-Fonts";
import { COLORS } from "../themes";


export const COLLECTION_POINTS = [
  {
    id: "1",
    title: "EcoHub Central",
    image: require("../../assets/images/geomap.png"),
    distance: "1,8 km",
    adress: "Rua das Flores, 123 - Centro",
    openingHours: "Segunda a Sexta • 08h às 18h",
    icon: "location-on",
    tags: ["🔋 Pilhas", "📱 Celulares", "💻 Notebooks"],
  },
  {
    id: "2",
    title: "TechRecycle",
    image: require("../../assets/images/ecoponto2.jpg"),
    distance: "2,7 km",
    adress: "Av. Brasil, 456 - Jardim América",
    openingHours: "Segunda a Sábado • 09h às 17h",
    icon: "location-on",
    tags: ["🖥️ Monitores", "🖨️ Impressoras"],
  },
  {
    id: "3",
    title: "Associação Comercial de Santos",
    image: require("../../assets/images/ecoponto3.webp"),
    distance: "3,5 km",
    adress: "Praça Mauá, 100 - Centro",
    openingHours: "Segunda a Sexta • 08h às 18h",
    icon: "location-on",
    tags: ["📺 TVs", "🔌 Cabos", "📱 Eletrônicos"],
  },
  {
    id: "4",
    title: "Centro de Coleta Tech",
    image: require("../../assets/images/ecoponto1.jpg"),
    distance: "4,1 km",
    
    adress: "Av. Brasil, 456 - Jardim América",
    openingHours: "Segunda a Sábado • 09h às 17h",
    icon: "location-on",
    tags: ["💻 Notebooks", "🖨️ Impressoras"],
  },
  {
    id: "5",
    title: "Reboot Reciclagem",
    image: require("../../assets/images/ecoponto2.jpg"),
    distance: "5,3 km",
    
    adress: "Rua das Flores, 123 - Centro",
    openingHours: "Segunda a Sexta • 08h às 18h",
    icon: "location-on",
    tags: ["🔋 Baterias", "💡 Lâmpadas"],
  },
];

export default function CollectionPointsScreen() {
  const router = useRouter();
  const { fontsLoaded } = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.onSurface} />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>Pontos de Coleta Disponíveis</Text>
            <Text style={styles.subtitle}>Confira nossos pontos parceiros</Text>
          </View>
        </View>

        <View style={styles.collectionList}>
          {COLLECTION_POINTS.map((item) => (
            <TouchableOpacity key={item.id} 
            style={styles.collectionItem}
            onPress={() =>
              router.push ({
                pathname: "/collection-points-details",
                params: { id: item.id.toString() }, 

              })
            }>
              <Image source={item.image}
                   style={styles.collectionImage}  />
              <View style={styles.collectionHeader}>
                

              <View style={styles.collectionIcon}>
                <MaterialIcons
                  name={item.icon as keyof typeof MaterialIcons.glyphMap}
                  size={24}
                  color={COLORS.primary}
                />
              </View>
              
              <View style={styles.collectionContent}>
          
    
                <Text style={styles.collectionTitle}>
                  {item.title}
                  </Text>

                  <Text style={styles.collectionDistance}>
                  {item.adress}
                  </Text>
          
                <Text style={styles.collectionDistance}>
                  A {item.distance} de distância
                </Text>
            </View>
              </View>

              <View style={styles.tagsContainer}>
    {item.tags.map((tag) => (
      <View key={tag} style={styles.tag}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
    ))}
  </View>

            </TouchableOpacity>
          ))}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceContainer,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.onSurface,
  },
  subtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
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
  collectionList: {
    gap: 12,
    marginBottom: 24,
  },
  collectionItem: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
  
    overflow: "hidden",
    gap: 14,
  },

  collectionImage: {
  width: "100%",
  height: 180,
},
  collectionIcon: {
    height: 50,
    width: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  collectionHeader: {
  flexDirection: "row",
  alignItems: "center",
   
},
  collectionContent: {
    flex: 1,
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
  tagsContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 6,
  marginTop: 8,
  padding: 16,
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
  fontSize: 11,
  color: COLORS.primary,
  fontFamily: "Manrope-Bold",
},
});
