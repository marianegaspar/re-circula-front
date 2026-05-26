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

interface SelectedItem {
  id: string;
  label: string;
  quantity: number;
}

interface MyCollectionModalProps {
  visible: boolean;
  items: SelectedItem[];

  onClose: () => void;
  onAddMore: () => void;
  onContinue: () => void;
}

export default function MyCollectionModal({
  visible,
  items,
  onClose,
  onAddMore,
  onContinue,
}: MyCollectionModalProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
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
              <Text style={styles.title}>Minha Coleta</Text>

              <Text style={styles.subtitle}>Revise os itens adicionados</Text>
            </View>
          </View>

          {/* Resume */}
          <View style={styles.resumeContainer}>
            <MaterialIcons
              name="inventory-2"
              size={18}
              color={COLORS.primary}
            />

            <Text style={styles.resumeText}>
              {totalItems} {totalItems === 1 ? "item" : "itens"} na coleta
            </Text>
          </View>

          {/* List */}
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons
                  name="delete-outline"
                  size={40}
                  color={COLORS.onSurfaceVariant}
                />

                <Text style={styles.emptyText}>
                  Nenhum item adicionado ainda.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <View style={styles.itemLeft}>
                  <View style={styles.iconWrapper}>
                    <MaterialIcons
                      name="devices"
                      size={22}
                      color={COLORS.primary}
                    />
                  </View>

                  <View>
                    <Text style={styles.itemLabel}>{item.label}</Text>

                    <Text style={styles.itemQuantity}>
                      Quantidade: {item.quantity}
                    </Text>
                  </View>
                </View>

                <MaterialIcons
                  name="check-circle"
                  size={22}
                  color={COLORS.primary}
                />
              </View>
            )}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.9}
              onPress={onAddMore}
            >
              <MaterialIcons name="add" size={22} color={COLORS.primary} />

              <Text style={styles.secondaryButtonText}>
                Adicionar mais itens
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.9}
              onPress={onContinue}
            >
              <Text style={styles.confirmButtonText}>
                Continuar Agendamento
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
    backgroundColor: COLORS.background + "10",
  },

  container: {
    height: "80%",
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
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
    fontFamily: "Manrope-SemiBold",
    marginBottom: 4,
  },

  itemQuantity: {
    color: COLORS.onSurfaceVariant,
    fontSize: 13,
    fontFamily: "Manrope-Regular",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },

  emptyText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 15,
    fontFamily: "Manrope-Regular",
  },

  footer: {
    gap: 14,
    paddingTop: 8,
  },

  secondaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },

  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontFamily: "Manrope-Bold",
  },

  confirmButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  confirmButtonText: {
    color: COLORS.onPrimary,
    fontSize: 16,
    fontFamily: "Manrope-Bold",
  },
});
