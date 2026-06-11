import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppFonts } from "../../../hooks/use-App-Fonts";
import { WebContainer } from "../../components/WebContainer";
import { COLORS } from "../../themes";

type SelectedItem = {
  id: string;
  label: string;
  quantity: number;
  category?: string;
};

type CategoryId =
  | "branca"
  | "eletronicos"
  | "informatica"
  | "climatizacao"
  | "outros";

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
  outros: { title: "Outros", icon: "archive-outline" },
};

const CATEGORY_ITEMS: Record<
  CategoryId,
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
    { id: "outros", label: "Outros", icon: "inventory-2" },
  ],
  eletronicos: [
    { id: "tv", label: "Televisão", icon: "tv" },
    { id: "dvd", label: "DVD", icon: "album" },
    { id: "caixa", label: "Caixa de Som", icon: "speaker" },
    { id: "modem", label: "Modem", icon: "router" },
    { id: "outros", label: "Outros", icon: "inventory-2" },
  ],
  informatica: [
    { id: "notebook", label: "Notebook", icon: "laptop" },
    { id: "monitor", label: "Monitor", icon: "desktop-windows" },
    { id: "mouse", label: "Mouse", icon: "mouse" },
    { id: "teclado", label: "Teclado / Mouse", icon: "keyboard" },
    { id: "impressora", label: "Impressora", icon: "print" },
    { id: "desktop", label: "Desktop / CPU", icon: "computer" },
    { id: "outros", label: "Outros", icon: "inventory-2" },
  ],
  climatizacao: [
    { id: "ar", label: "Ar Condicionado", icon: "ac-unit" },
    { id: "ventilador", label: "Ventilador", icon: "air" },
    { id: "umidificador", label: "Umidificador", icon: "water-drop" },
    { id: "outros", label: "Outros", icon: "inventory-2" },
  ],
  outros: [],
};

export default function ColectItens() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    selectedItems?: string;
    deliveryType?: string;
    pointId?: string;
    pointName?: string;
    pointAddress?: string;
    pointHours?: string;
  }>();
  const { fontsLoaded } = useAppFonts();

  const initialItems = React.useMemo<SelectedItem[]>(() => {
    try {
      return params.selectedItems ? JSON.parse(params.selectedItems) : [];
    } catch {
      return [];
    }
  }, [params.selectedItems]);

  const [selectedItems, setSelectedItems] = React.useState<SelectedItem[]>(initialItems);
  const [editingCategory, setEditingCategory] = React.useState<CategoryId | null>(null);
  const [draftSelection, setDraftSelection] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    setSelectedItems(initialItems);
  }, [initialItems]);

  const groupedItems = React.useMemo(() => {
    return selectedItems.reduce<Record<string, SelectedItem[]>>((acc, item) => {
      const category = item.category || "outros";

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(item);
      return acc;
    }, {});
  }, [selectedItems]);

  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const openEditor = (category: string) => {
    const categoryId = (category in CATEGORY_ITEMS ? category : "outros") as CategoryId;
    const currentItems = groupedItems[category] || [];
    const nextDraft = currentItems.reduce<Record<string, number>>((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {});

    setDraftSelection(nextDraft);
    setEditingCategory(categoryId);
  };

  const updateDraftQty = (itemId: string, delta: number) => {
    setDraftSelection((current) => ({
      ...current,
      [itemId]: Math.max(0, (current[itemId] || 0) + delta),
    }));
  };

  const saveCategoryChanges = () => {
    if (!editingCategory) return;

    const catalog = CATEGORY_ITEMS[editingCategory] || [];
    const nextCategoryItems = catalog
      .map((item) => ({
        id: item.id,
        label: item.label,
        quantity: draftSelection[item.id] || 0,
        category: editingCategory,
      }))
      .filter((item) => item.quantity > 0);

    setSelectedItems((current) => {
      const remaining = current.filter(
        (item) => (item.category || "outros") !== editingCategory,
      );
      return [...remaining, ...nextCategoryItems];
    });

    setEditingCategory(null);
    setDraftSelection({});
  };

  const modalItems = editingCategory ? CATEGORY_ITEMS[editingCategory] || [] : [];
  const modalTitle = editingCategory
    ? `Editar ${CATEGORY_META[editingCategory]?.title || "categoria"}`
    : "";
  const isDropOff = params.deliveryType === "dropoff";

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
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

          <View style={styles.stepContainer}>
            <View style={styles.stepLine} />

            <View style={styles.stepWrapper}>
              <View style={[styles.stepDot, styles.stepDotActive]}>
                <Text style={styles.stepDotTextActive}>1</Text>
              </View>
              <Text style={[styles.stepLabel, styles.stepLabelActive]}>Itens</Text>
            </View>

            <View style={styles.stepWrapper}>
              <View style={[styles.stepDot]}>
                <Text style={styles.stepDotText}>2</Text>
              </View>
              <Text style={[styles.stepLabel]}>Data</Text>
            </View>

            <View style={styles.stepWrapper}>
              <View style={styles.stepDot}>
                <Text style={styles.stepDotText}>3</Text>
              </View>
              <Text style={styles.stepLabel}>Confirma</Text>
            </View>
          </View>

          <Text style={styles.title}>Minha coleta</Text>
          <Text style={styles.subtitle}>Revise os itens que você adicionou.</Text>

          <View style={styles.cardsList}>
            {Object.entries(groupedItems).map(([category, items]) => {
              const meta = CATEGORY_META[category] || CATEGORY_META.outros;
              const categoryTotal = items.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <View key={category} style={styles.categoryCard}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryHeaderLeft}>
                      <View style={styles.categoryIconBox}>
                        <MaterialCommunityIcons
                          name={meta.icon}
                          size={24}
                          color={COLORS.primary}
                        />
                      </View>
                      <Text style={styles.categoryTitle}>{meta.title}</Text>
                    </View>

                    <View style={styles.categoryHeaderRight}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{categoryTotal}</Text>
                      </View>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => openEditor(category)}
                      >
                        <Feather name="edit-3" size={18} color={COLORS.secondary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.itemsList}>
                    {items.map((item) => (
                      <View key={item.id} style={styles.itemRow}>
                        <Text style={styles.itemLabel}>{item.label}</Text>
                        <Text style={styles.itemCount}>{item.quantity}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}

            {selectedItems.length === 0 ? (
              <View style={styles.categoryCard}>
                <Text style={styles.emptyText}>Nenhum item selecionado ainda.</Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.addMoreButton}
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <MaterialIcons name="add" size={28} color={COLORS.primary} />
            <Text style={styles.addMoreText}>Adicionar mais itens</Text>
          </TouchableOpacity>

          <View style={styles.summaryGrid}>
            <View style={styles.totalCard}>
              <Text style={styles.summaryLabel}>Total de itens</Text>
              <Text style={styles.totalValue}>{totalItems}</Text>
            </View>

            <View style={styles.impactCard}>
              <View style={styles.impactIconWrap}>
                <MaterialCommunityIcons
                  name="leaf"
                  size={28}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.impactContent}>
                <Text style={styles.summaryLabel}>Impacto positivo</Text>
                <Text style={styles.impactText}>
                  Você evita que{" "}
                  <Text style={styles.impactHighlight}>mais de 15kg</Text> de
                  material poluente contamine o solo.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            activeOpacity={0.9}
            onPress={() =>
              isDropOff
                ? router.push({
                    pathname: "/colect/revision",
                    params: {
                      selectedItems: JSON.stringify(selectedItems),
                      deliveryType: "dropoff",
                      pointId: params.pointId || "",
                      pointName: params.pointName || "",
                      pointAddress: params.pointAddress || "",
                      pointHours: params.pointHours || "",
                    },
                  })
                : router.push({
                    pathname: "/colect/schedule",
                    params: {
                      selectedItems: JSON.stringify(selectedItems),
                      deliveryType: "pickup",
                    },
                  })
            }
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        </WebContainer>
      </ScrollView>

      <Modal
        visible={!!editingCategory}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingCategory(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setEditingCategory(null)}
              >
                <MaterialIcons name="close" size={28} color="#F2F6FF" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalList}>
              {modalItems.map((item) => {
                const qty = draftSelection[item.id] || 0;
                const plusDisabled = qty >= 99;

                return (
                  <View key={item.id} style={styles.modalItemRow}>
                    <View style={styles.modalItemLeft}>
                      <MaterialIcons
                        name={item.icon}
                        size={24}
                        color={COLORS.onSurfaceVariant}
                      />
                      <Text style={styles.modalItemLabel}>{item.label}</Text>
                    </View>

                    <View style={styles.qtyControls}>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        activeOpacity={0.8}
                        onPress={() => updateDraftQty(item.id, -1)}
                      >
                        <Text style={styles.qtyButtonText}>−</Text>
                      </TouchableOpacity>

                      <View style={styles.qtyValueBox}>
                        <Text style={styles.qtyValueText}>{qty}</Text>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.qtyButton,
                          styles.qtyButtonPlus,
                          plusDisabled ? styles.qtyButtonDisabled : null,
                        ]}
                        activeOpacity={0.8}
                        disabled={plusDisabled}
                        onPress={() => updateDraftQty(item.id, 1)}
                      >
                        <Text
                          style={[
                            styles.qtyButtonText,
                            styles.qtyButtonPlusText,
                            plusDisabled ? styles.qtyButtonDisabledText : null,
                          ]}
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.modalSaveButton}
              activeOpacity={0.9}
              onPress={saveCategoryChanges}
            >
              <Text style={styles.modalSaveButtonText}>Salvar alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
    paddingBottom: 36,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    marginBottom: 24,
  },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 34,
    position: "relative",
  },
  stepLine: {
    position: "absolute",
    top: 18,
    left: 28,
    right: 28,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.12)",
    zIndex: 0,
  },
  stepWrapper: {
    alignItems: "center",
    zIndex: 1,
    width: 88,
    gap: 10,
  },
  stepDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceContainerHighest,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: COLORS.primaryContainer,
  },
  stepDotText: {
    color: COLORS.onSurface,
    fontWeight: "800",
  },
  stepDotTextActive: {
    color: COLORS.onPrimary,
    fontWeight: "800",
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#bbcabf",
  },
  stepLabelActive: {
    color: COLORS.primary,
  },
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 24,
    color: "#F2F6FF",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    marginBottom: 28,
  },
  cardsList: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: "rgba(23, 31, 51, 0.95)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  categoryHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(78, 222, 163, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTitle: {
    color: "#F2F6FF",
    fontFamily: "Manrope-Bold",
    fontSize: 18,
  },
  categoryBadge: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: COLORS.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBadgeText: {
    color: COLORS.onPrimary,
    fontWeight: "800",
    fontSize: 13,
  },
  itemsList: {
    gap: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemLabel: {
    color: COLORS.onSurfaceVariant,
    fontSize: 16,
    fontFamily: "Manrope-Regular",
  },
  itemCount: {
    color: "#F2F6FF",
    fontSize: 18,
    fontFamily: "Manrope-Bold",
  },
  emptyText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 15,
    fontFamily: "Manrope-Regular",
  },
  addMoreButton: {
    marginTop: 18,
    marginBottom: 20,
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(78, 222, 163, 0.28)",
    backgroundColor: "rgba(78, 222, 163, 0.03)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addMoreText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: "Manrope-Bold",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 0,
    marginBottom: 24,
  },
  totalCard: {
    width: "34%",
    backgroundColor: "rgba(11, 56, 42, 0.7)",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(78, 222, 163, 0.2)",
    padding: 18,
    justifyContent: "space-between",
  },
  impactCard: {
    flex: 1,
    backgroundColor: "rgba(23, 31, 51, 0.95)",
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 18,
    flexDirection: "row",
    gap: 12,
  },
  summaryLabel: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    fontFamily: "Manrope-Bold",
    marginBottom: 10,
  },
  totalValue: {
    color: "#F2F6FF",
    fontSize: 54,
    lineHeight: 58,
    fontFamily: "Manrope-Bold",
  },
  impactIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(78, 222, 163, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  impactContent: {
    flex: 1,
  },
  impactText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "Manrope-Regular",
  },
  impactHighlight: {
    color: COLORS.primary,
    fontFamily: "Manrope-Bold",
  },
  continueButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primaryContainer,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
  continueButtonText: {
    color: COLORS.onPrimary,
    fontSize: 18,
    fontFamily: "Manrope-Bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    backgroundColor: "rgba(11, 19, 38, 0.98)",
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  modalTitle: {
    color: "#F2F6FF",
    fontFamily: "Manrope-Bold",
    fontSize: 20,
  },
  modalList: {
    gap: 18,
    marginBottom: 24,
  },
  modalItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },
  modalItemLabel: {
    color: "#F2F6FF",
    fontFamily: "Manrope-Regular",
    fontSize: 16,
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceContainerHighest,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonPlus: {
    backgroundColor: COLORS.primaryContainer,
  },
  qtyButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  qtyButtonText: {
    color: COLORS.onSurface,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 24,
  },
  qtyButtonPlusText: {
    color: COLORS.onPrimary,
  },
  qtyButtonDisabledText: {
    color: COLORS.outline,
  },
  qtyValueBox: {
    minWidth: 44,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  qtyValueText: {
    color: "#F2F6FF",
    fontFamily: "Manrope-Bold",
    fontSize: 18,
  },
  modalSaveButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSaveButtonText: {
    color: COLORS.onPrimary,
    fontSize: 18,
    fontFamily: "Manrope-Bold",
  },
});
