import { MaterialCommunityIcons, MaterialIcons, } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAppFonts } from "../../hooks/use-App-Fonts";
import { COLORS } from "../themes";



type CollectionItem = {
  id: string;
  label: string;
  quantity: number;
  category: string;
};


export default function ColectRevision() {
  const router = useRouter();
    const params = useLocalSearchParams<{
    selectedItems?: string;
  }>();

  const { fontsLoaded } = useAppFonts();

  const [modalVisible, setModalVisible] = useState(false);
  const [selection, setSelection] = useState<Record<string, number>>({});

  const collectionItems: CollectionItem[] = React.useMemo(() => {
    try {
      return params.selectedItems
        ? JSON.parse(params.selectedItems)
        : [];
    } catch {
      return [];
    }
  }, [params.selectedItems]);

  // AGRUPAR POR CATEGORIA
  const groupedItems = collectionItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }

      acc[item.category].push(item);

      return acc;
    },
    {} as Record<string, CollectionItem[]>,
  );

  const categoryTitles: Record<string, string> = {
    informatica: "Informática",
    eletronicos: "Eletrônicos",
    branca: "Linha Branca",
    climatizacao: "Climatização",
  };

  const categoryIcons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
    informatica: "laptop",
    eletronicos: "devices",
    branca: "fridge-outline",
    climatizacao: "air-conditioner",
  };

  const totalItems = collectionItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );


  if (!fontsLoaded) return null;

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

        {/* Step Indicator */}
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
        <TouchableOpacity>

             <MaterialIcons
                        name="arrow-back"
                        size={22}
                        color={COLORS.onSurface}
                      />

         <Text style={styles.title}>Revisão do Pedido</Text>
                <Text style={styles.subtitle}>
                  Quase lá. Verifique os detalhes da sua coleta digital e confirme o circuito de reciclagem.
                </Text>

                
                </TouchableOpacity>

            {/* ITENS */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.iconBox}>
                <MaterialIcons
                  name="inventory-2"
                  size={20}
                  color={COLORS.primary}
                />
              </View>

              <Text style={styles.cardTitle}>
                Itens Selecionados
              </Text>
            </View>

            <TouchableOpacity>
              <Text style={styles.editText}>EDITAR</Text>
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
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    marginLeft: 8,
  },

  // Step Indicator
  stepContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 240,
    alignSelf: "center",
    marginBottom: 40,
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
  // Content
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 32,
    fontWeight: "800",
    color: "#dae2fd",
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 15,
    color: "#bbcabf",
    lineHeight: 22,
    marginBottom: 32,
  },

  listaItensContainer: {
    marginBottom: 24,
  },

  itemLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },

  itemLinhaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemIcon: {
    marginRight: 12,
  },

  itemLinhaTexto: {
    color: COLORS.onSurface,
    fontFamily: 'Manrope-Bold',
    fontSize: 15,
  },

  itemLinhaQuantidade: {
    color: COLORS.onSurfaceVariant,
    fontFamily: 'Manrope-Regular',
  },

  // CARD
  card: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },

  cardHeader: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
    alignItems: "center",
  },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    color: COLORS.onSurface,
    fontSize: 16,
    fontWeight: "700",
  },

  cardDescription: {
    color: COLORS.onSurfaceVariant,
    fontSize: 13,
    marginTop: 2,
  },

  editText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },

   // CATEGORY
  categoryCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },

  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
  },

  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  categoryTitle: {
    color: COLORS.onSurface,
    fontWeight: "700",
    fontSize: 15,
  },

  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#003824",
    fontWeight: "800",
    fontSize: 12,
  },

  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },

  itemLabel: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
  },

  itemQty: {
    color: COLORS.onSurface,
    fontWeight: "700",
  },



});
