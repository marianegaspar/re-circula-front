import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAppFonts } from "../../hooks/use-App-Fonts";
import CategoryModal from "../components/CategoryModal";
import CollectModal from "../components/CollectModal";
import { COLORS } from "../themes";

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = (screenWidth - 40 - 12) / 2;
// 1. Interfaces e Tipagens
type CategoriaId = "branca" | "eletronicos" | "informatica" | "climatizacao";

interface Categoria {
  id: CategoriaId;
  titulo: string;
  subtitulo: string;
  icon: string;
}

//grid home
const CATEGORIAS: Categoria[] = [
  {
    id: "branca",
    titulo: "Linha Branca",
    subtitulo: "Grandes eletros",
    icon: "kitchen",
  },
  {
    id: "eletronicos",
    titulo: "Eletrônicos",
    subtitulo: "TVs e Áudio",
    icon: "devices",
  },
  {
    id: "informatica",
    titulo: "Informática",
    subtitulo: "PCs e Acessórios",
    icon: "laptop_mac",
  },
  {
    id: "climatizacao",
    titulo: "Climatização",
    subtitulo: "Ar e Ventilação",
    icon: "ac_unit",
  },
];

export default function ColectScreen() {
  const { fontsLoaded } = useAppFonts();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<CategoriaId | null>(null);
  const [quantidade, setQuantidade] = useState<number>(0);
  const [activeModal, setActiveModal] = useState<CategoriaId | null>(null);
  //criar estado de erro
  const [showError, setShowError] = useState(false);

  //array unico
  const CATEGORY_ITEMS: Record<
    CategoriaId,
    {
      id: string;
      label: string;
      icon: keyof typeof MaterialIcons.glyphMap;
    }[]
  > = {
    branca: [
      { id: "geladeira", label: "Geladeira", icon: "kitchen" },
      { id: "fogao", label: "Fogão", icon: "microwave" },
      {
        id: "maquina",
        label: "Máquina de Lavar",
        icon: "local-laundry-service",
      },
      { id: "microondas", label: "Microondas", icon: "microwave" },
      { id: "outros", label: "Outros",icon: "inventory-2"},
    ],

    eletronicos: [
      { id: "tv", label: "Televisão", icon: "tv" },
      { id: "dvd", label: "DVD", icon: "album" },
      { id: "caixa", label: "Caixa de Som", icon: "speaker" },
      { id: "modem", label: "Modem", icon: "router" },
       { id: "outros", label: "Outros",icon: "inventory-2"},
    ],

    informatica: [
      { id: "notebook", label: "Notebook", icon: "laptop" },
      { id: "monitor", label: "Monitor", icon: "desktop-windows" },
      { id: "mouse", label: "Mouse", icon: "mouse" },
      { id: "teclado", label: "Teclado", icon: "keyboard" },
       { id: "outros", label: "Outros",icon: "inventory-2"},
    ],

    climatizacao: [
      { id: "ar", label: "Ar Condicionado", icon: "ac-unit" },
      { id: "ventilador", label: "Ventilador", icon: "air" },
      { id: "umidificador", label: "Umidificador", icon: "water-drop" },
       { id: "outros", label: "Outros",icon: "inventory-2"},
    ],
  };

  const [selection, setSelection] = useState<
    Record<string, Record<string, number>>
  >({
    branca: {},
    eletronicos: {},
    informatica: {},
    climatizacao: {},
  });

  const changeQty = (
    categoryId: CategoriaId,
    itemId: string,
    delta: number,
  ) => {
    setSelection((prev) => {
      const currentQty = prev[categoryId]?.[itemId] || 0;

      return {
        ...prev,

        [categoryId]: {
          ...prev[categoryId],

          [itemId]: Math.max(0, currentQty + delta),
        },
      };
    });
  };
  const totalAdded = Object.values(selection)
    .flatMap((category) => Object.values(category))
    .reduce((sum, qty) => sum + qty, 0);

  //ESTADO MODAL DE MINHA COLETA
  const [collectionModalVisible, setCollectionModalVisible] = useState(false);

  const modalItems = activeModal
  ? CATEGORY_ITEMS[activeModal]
  : [];

  const collectionItems = Object.entries(selection).flatMap(
    ([catId, items]) =>
      Object.entries(items)
        .filter(([, qty]) => qty > 0)
        .map(([itemId, qty]) => {
          const category = CATEGORY_ITEMS[catId as CategoriaId] || [];
          const found = category.find((it) => it.id === itemId);
          return {
            id: itemId,
            label: found ? found.label : itemId,
            quantity: qty,
            category: catId,
          };
        }),
  );

  //alertas de botao


  if (!fontsLoaded) {
    return null; // O App fica travado na Splash Screen até as fontes estarem prontas
  }

  return (
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

      {/* Conteúdo Rolável */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Indicator */}
        <View style={styles.stepContainer}>
          <View style={styles.stepLine} />

          <View style={styles.stepWrapper}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={styles.stepDotTextActive}>1</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>
              Itens
            </Text>
          </View>

          <View style={styles.stepWrapper}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Data</Text>
          </View>

          <View style={styles.stepWrapper}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Confirma</Text>
          </View>
        </View>

        {/* Editorial Header */}
        <View style={styles.editorialContainer}>
          <Text style={styles.tituloPrincipal}>
            O que vamos <Text style={styles.textHighlight}>recircular</Text>{" "}
            hoje?
          </Text>
          <Text style={styles.subtituloPrincipal}>
            Selecione as categorias dos itens que deseja descartar de forma
            consciente.
          </Text>
        </View>

        {/* Category Grid */}
        <View style={styles.gridCategorias}>
          {CATEGORIAS.map((cat) => {
            const isSelected = categoriaSelecionada === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() => {
                  setCategoriaSelecionada(cat.id);
                  setActiveModal(cat.id);
                }}
                style={[
                  styles.cardCategoria,
                  isSelected
                    ? styles.cardCategoriaSelected
                    : styles.cardCategoriaUnselected,
                ]}
              >
                {isSelected && (
                  <View style={styles.checkIconPosition}>
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color="#4edea3"
                    />
                  </View>
                )}

                <View
                  style={[
                    styles.iconWrapper,
                    isSelected
                      ? styles.iconWrapperSelected
                      : styles.iconWrapperUnselected,
                  ]}
                >
                  {cat.id === "informatica" ? (
                    <MaterialCommunityIcons
                      name="laptop"
                      size={28}
                      color="#4edea3"
                    />
                  ) : cat.id === "climatizacao" ? (
                    <MaterialCommunityIcons
                      name="air-conditioner"
                      size={28}
                      color="#4edea3"
                    />
                  ) : (
                    <MaterialIcons
                      name={cat.icon as any}
                      size={28}
                      color="#4edea3"
                    />
                  )}
                </View>

                <Text style={styles.cardTitulo}>{cat.titulo}</Text>
                <Text
                  style={[
                    styles.cardSubtitulo,
                    isSelected
                      ? styles.cardSubtituloSelected
                      : styles.cardSubtituloUnselected,
                  ]}
                >
                  {cat.subtitulo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {totalAdded > 0 && (
          <TouchableOpacity style={styles.summaryCard} activeOpacity={0.9}>
            <View style={styles.summaryCardHeader}>
              <View style={styles.summaryCardCountWrapper}>
                <MaterialIcons
                  name="checklist"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.summaryCardCount}>
                  {totalAdded === 1
                    ? "1 item adicionado"
                    : `${totalAdded} itens adicionados`}
                </Text>
              </View>
              <MaterialIcons
                name="arrow-forward-ios"
                size={18}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.summaryCardSubtitle}>coleta</Text>
            <Text style={styles.summaryCardAction}>Ver minha coleta</Text>
          </TouchableOpacity>
        )}

        {/* Footer Action Button */}
        <View style={styles.footerActionContainer}>


          {showError && (
  <View style={styles.errorContainer}>
    <MaterialIcons
      name="warning"
      size={20}
      color="#FF9800"
    />

    <Text style={styles.errorMessage}>
      Selecione pelo menos um item para continuar.
    </Text>

    <TouchableOpacity
      onPress={() => setShowError(false)}
    >
      <MaterialIcons
        name="close"
        size={20}
        color="#666"
      />
    </TouchableOpacity>
  </View>
)}

          <TouchableOpacity
            style={styles.btnPrincipal}
            activeOpacity={0.9}
            onPress={() => {
              // Construir array de itens selecionados para enviar à tela de agendamento
              const selectedItems = Object.entries(selection).flatMap(
                ([catId, items]) =>
                  Object.entries(items)
                    .filter(([, qty]) => qty > 0)
                    .map(([itemId, qty]) => {
                      const category =
                        CATEGORY_ITEMS[catId as CategoriaId] || [];
                      const found = category.find((it) => it.id === itemId);
                      return {
                        id: itemId,
                        label: found ? found.label : itemId,
                        quantity: qty,
                        category: catId,
                      };
                    }),
              );

                // Verifica se não há itens
                if (selectedItems.length === 0) {
                  setShowError(true);

                  setTimeout(() => {
                    setShowError(false);
                  }, 3000);
        

                  return;
                 
                }

                  // Esconde erro caso tenha itens
                  setShowError(false);

              router.push({
                pathname: "/colect-schedule",
                params: { selectedItems: JSON.stringify(selectedItems) },
              });
            }}
          >
            <Text style={styles.btnPrincipalTexto}>Continuar Agendamento</Text>
          </TouchableOpacity>

          <View style={styles.infoTaxaContainer}>
            <MaterialIcons name="info" size={14} color="#bbcabf" />
            <Text style={styles.infoTaxaTexto}>
              Taxa de coleta sob consulta para itens de grande porte.
            </Text>
          </View>
        </View>
      </ScrollView>

      <CategoryModal
        visible={!!activeModal}
        categoryTitle={
          CATEGORIAS.find((cat) => cat.id === activeModal)?.titulo || ""
        }
        items={activeModal ? CATEGORY_ITEMS[activeModal as CategoriaId] : []}
        selection={activeModal ? selection[activeModal as CategoriaId] : {}}
        onClose={() => setActiveModal(null)}
        onConfirm={() => setActiveModal(null)}
        onChangeQty={(itemId, delta) => {
          if (!activeModal) return;

          changeQty(activeModal, itemId, delta);
        }}
      />

      <CollectModal
        visible={collectionModalVisible}
        items={collectionItems}
        onClose={() => setCollectionModalVisible(false)}
        onAddMore={() => setCollectionModalVisible(false)}
        onContinue={() => {
          setCollectionModalVisible(false);
          router.push({
            pathname: "/colect-schedule",
            params: { selectedItems: JSON.stringify(collectionItems) },
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },

  scrollContent: {
    flexGrow: 1,
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

  bentoGrid: { gap: 16, marginBottom: 16 },
  mainImpactCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.outline + "10",
    overflow: "hidden",
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

  // Editorial Header
  editorialContainer: {
    marginBottom: 32,
  },
  tituloPrincipal: {
    fontSize: 32,
    fontWeight: "800",
    color: "#dae2fd",
    lineHeight: 40,
    marginBottom: 12,
  },
  textHighlight: {
    color: "#4edea3",
  },
  subtituloPrincipal: {
    fontSize: 15,
    color: "#bbcabf",
    lineHeight: 22,
    maxWidth: 320,
  },
  // Grid Categorias
  gridCategorias: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  cardCategoria: {
    width: cardWidth,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    position: "relative",
    marginBottom: 12,
  },
  cardCategoriaUnselected: {
    backgroundColor: "#131b2e",
    borderColor: "rgba(60, 74, 66, 0.2)",
  },
  cardCategoriaSelected: {
    backgroundColor: "#222a3d",
    borderColor: "#4edea3",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  checkIconPosition: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconWrapperUnselected: {
    backgroundColor: "#2d3449",
  },
  iconWrapperSelected: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  cardTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#dae2fd",
  },
  cardSubtitulo: {
    fontSize: 10,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: -0.3,
  },
  cardSubtituloUnselected: {
    color: "#bbcabf",
  },
  cardSubtituloSelected: {
    color: "#4edea3",
  },
  summaryCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.18)",
    padding: 20,
    marginBottom: 24,
  },
  summaryCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryCardCountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryCardCount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#dae2fd",
    marginBottom: 0,
  },
  summaryCardSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#f87171",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryCardAction: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: 8,
  },

  // Bento Quantity
  bentoContainer: {
    backgroundColor: "#060e20",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 24,
  },
  bentoLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#bbcabf",
    marginBottom: 16,
  },
  contadorControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#171f33",
    borderRadius: 30,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(60, 74, 66, 0.2)",
  },
  btnContadorAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2d3449",
    justifyContent: "center",
    alignItems: "center",
  },
  btnContadorActionPlus: {
    backgroundColor: "#10b981",
  },
  btnContadorTexto: {
    color: "#dae2fd",
    fontSize: 20,
    fontWeight: "bold",
  },
  btnContadorTextoPlus: {
    color: "#003824",
  },
  contadorValor: {
    fontSize: 28,
    fontWeight: "800",
    color: "#dae2fd",
  },
  // Impact Banner
  impactBanner: {
    backgroundColor: "rgba(6, 78, 59, 0.2)",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginBottom: 40,
  },
  impactIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  impactTextWrapper: {
    flex: 1,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#dae2fd",
    marginBottom: 4,
  },
  impactDescription: {
    fontSize: 13,
    color: "#bbcabf",
    lineHeight: 18,
  },
  impactHighlight: {
    color: "#34d399",
    fontWeight: "700",
  },
  // Footer Button
  footerActionContainer: {
    alignItems: "center",
    gap: 16,
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
  infoTaxaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoTaxaTexto: {
    fontSize: 11,
    color: "#bbcabf",
  },
  // Bottom Navigation Bar
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 12 : 0,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    gap: 4,
  },
  navItemActive: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  navText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  navTextActive: {
    color: "#4edea3",
    fontWeight: "700",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  modalContent: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.outline + "10",
    marginTop: 80,
  },

  modalTitle: {
    fontFamily: "Manrope-Bold",
    fontSize: 20,
    color: COLORS.onSurface,
    marginBottom: 12,
  },
  modalBody: {
    fontFamily: "Manrope-Regular",
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    marginBottom: 24,
    lineHeight: 22,
  },
  modalCloseButton: {
    width: "100%",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
  },
  modalCloseText: {
    color: COLORS.onPrimary,
    fontFamily: "Manrope-Bold",
    fontSize: 14,
    textAlign: "center",
  },
  modalBackButton: {
    position: "absolute",
    top: 32,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline + "10",
  },
  modalItemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  modalItemLabel: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Regular",
    fontSize: 16,
  },
  qtyControls: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonPlus: { backgroundColor: COLORS.primary },
  qtyText: { color: COLORS.onSurface, fontWeight: "700" },
  qtyTextPlus: { color: COLORS.onPrimary },
  qtyNumber: { color: COLORS.onSurface, minWidth: 20, textAlign: "center" },

errorContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFF4E5",
  borderWidth: 1,
  borderColor: "#FFCC80",
  paddingVertical: 12,
  paddingHorizontal: 14,
  borderRadius: 12,
  marginBottom: 12,
},

errorMessage: {
  flex: 1,
  marginHorizontal: 10,
  color: "#5D4037",
  fontSize: 14,
  fontWeight: "500",
},
});
