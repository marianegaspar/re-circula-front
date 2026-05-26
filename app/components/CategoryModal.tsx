import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../themes";

interface Item {
  id: string;
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

interface CategoryModalProps {
  visible: boolean;
  categoryTitle: string;
  items: Item[];
  selection: Record<string, number>;

  onClose: () => void;
  onChangeQty: (id: string, delta: number) => void;
  onConfirm: () => void;
}

export default function CategoryModal({
  visible,
  categoryTitle,
  items,
  selection,
  onClose,
  onChangeQty,
  onConfirm,
}: CategoryModalProps) {
  const totalItems = Object.values(selection).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.backButton}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="arrow-back"
                size={22}
                color={COLORS.onSurface}
              />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <Text style={styles.title}>{categoryTitle}</Text>

              <Text style={styles.subtitle}>
                Selecione os itens que deseja descartar
              </Text>
            </View>
          </View>

          {/* Counter Resume */}
          {totalItems > 0 && (
            <View style={styles.resumeContainer}>
              <MaterialIcons
                name="inventory-2"
                size={18}
                color={COLORS.primary}
              />

              <Text style={styles.resumeText}>
                {totalItems} {totalItems === 1 ? "item" : "itens"} adicionados
              </Text>
            </View>
          )}

          {/* List */}
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const qty = selection[item.id] ?? 0;

              return (
                <View style={styles.itemCard}>
                  <View style={styles.itemLeft}>
                    <View style={styles.iconWrapper}>
                      <MaterialIcons
                        name={item.icon || "devices"}
                        size={22}
                        color={COLORS.primary}
                      />
                    </View>

                    <Text style={styles.itemLabel}>{item.label}</Text>
                  </View>

                  {/* Quantity */}
                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => onChangeQty(item.id, -1)}
                    >
                      <Text style={styles.qtyText}>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyNumber}>{qty}</Text>

                    <TouchableOpacity
                      style={[styles.qtyButton, styles.qtyButtonPlus]}
                      onPress={() => onChangeQty(item.id, 1)}
                    >
                      <Text style={styles.qtyTextPlus}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              disabled={totalItems === 0}
              activeOpacity={0.9}
              onPress={onConfirm}
              style={[
                styles.confirmButton,
                totalItems === 0 && styles.confirmButtonDisabled,
              ]}
            >
              <Text style={styles.confirmButtonText}>
                Adicionar à minha coleta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  container: {
    height: "88%",
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },

  handle: {
    width: 56,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "center",
    marginBottom: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 26,
    fontFamily: "Manrope-Bold",
    color: COLORS.onSurface,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
  },

  resumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(16,185,129,0.12)",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 24,
    gap: 8,
  },

  resumeText: {
    color: COLORS.primary,
    fontFamily: "Manrope-Bold",
    fontSize: 13,
  },

  listContent: {
    paddingBottom: 24,
    gap: 14,
  },

  itemCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },

  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(16,185,129,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  itemLabel: {
    color: COLORS.onSurface,
    fontSize: 16,
    fontFamily: "Manrope-Bold",
  },

  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  qtyButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },

  qtyButtonPlus: {
    backgroundColor: COLORS.primary,
  },

  qtyText: {
    color: COLORS.onSurface,
    fontSize: 18,
    fontFamily: "Manrope-Bold",
  },

  qtyTextPlus: {
    color: COLORS.onPrimary,
    fontSize: 18,
    fontFamily: "Manrope-Bold",
  },

  qtyNumber: {
    width: 20,
    textAlign: "center",
    color: COLORS.onSurface,
    fontSize: 16,
    fontFamily: "Manrope-Bold",
  },

  footer: {
    paddingTop: 12,
  },

  confirmButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  confirmButtonDisabled: {
    opacity: 0.4,
  },

  confirmButtonText: {
    color: COLORS.onPrimary,
    fontSize: 16,
    fontFamily: "Manrope-Bold",
  },
});
