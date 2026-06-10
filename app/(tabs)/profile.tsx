import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where
} from "firebase/firestore";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppFonts } from "../../hooks/use-App-Fonts";
import { auth, db } from "../../src/services/firebase";
import { LevelProgressBar } from "../components/LevelProgressBar";
import { COLORS } from "../themes";
import { getLevel } from "../utils/levels";

type AddressForm = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};

type UserProfile = {
  fullName?: string;
  email?: string;
  createdAt?: {
    toDate?: () => Date;
  };
};

const EMPTY_ADDRESS: AddressForm = {
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

function isCompleteAddress(address: AddressForm) {
  return [
    address.cep,
    address.street,
    address.number,
    address.neighborhood,
    address.city,
    address.state,
  ].every(Boolean);
}

export default function ProfileScreen() {
  const { fontsLoaded } = useAppFonts();
  const user = auth.currentUser;
  const [address, setAddress] = React.useState<AddressForm>(EMPTY_ADDRESS);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [schedulesCount, setSchedulesCount] = React.useState(0);
  const [pointsBalance, setPointsBalance] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [isEditingAddress, setIsEditingAddress] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errors, setErrors] = React.useState({
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  React.useEffect(() => {
    async function loadUserAddress() {
      if (!user) {
        setLoading(false);
        return;
      }

      const [userDoc, schedulesSnapshot] = await Promise.all([
        getDoc(doc(db, "users", user.uid)),
        getDocs(
          query(collection(db, "schedules"), where("userId", "==", user.uid))
        ),
      ]);
      const data = userDoc.data();

      setProfile(data || null);
      setSchedulesCount(schedulesSnapshot.size);
      setPointsBalance(data?.pointsBalance || 0);

      if (data?.address) {
        const loadedAddress = {
          cep: data.address.cep || "",
          street: data.address.street || "",
          number: data.address.number || "",
          complement: data.address.complement || "",
          neighborhood: data.address.neighborhood || "",
          city: data.address.city || "",
          state: data.address.state || "",
        };

        setAddress(loadedAddress);
        setIsEditingAddress(!isCompleteAddress(loadedAddress));
      } else {
        setIsEditingAddress(true);
      }

      setLoading(false);
    }

    loadUserAddress();
  }, [user]);

  // Escuta mudanças de pontos em tempo real
  React.useEffect(() => {
    if (!user) return;

    console.log("[PROFILE] Iniciando onSnapshot para pointsBalance");

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const userData = snapshot.data();
      const balance = userData?.pointsBalance || 0;
      console.log("[PROFILE] pointsBalance atualizado:", balance);
      setPointsBalance(balance);
    });

    return () => {
      console.log("[PROFILE] Limpando onSnapshot");
      unsubscribe();
    };
  }, [user]);

  if (!fontsLoaded) {
    return null;
  }

  const completedAddressFields = [
    address.cep,
    address.street,
    address.number,
    address.neighborhood,
    address.city,
    address.state,
  ].filter(Boolean).length;
  const isAddressComplete = completedAddressFields === 6;
  const addressSummary =
    isAddressComplete
      ? `${address.street}, ${address.number} - ${address.neighborhood}`
      : "Complete seu endereço para agilizar a coleta.";
  const memberSince = formatMemberSince(profile?.createdAt);

  function updateAddress(field: keyof AddressForm, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
    setSuccessMessage("");

    if (field in errors) {
      setErrors((current) => ({ ...current, [field]: "" }));
    }
  }

  async function handleSaveAddress() {
    const normalizedAddress = {
      cep: address.cep.trim(),
      street: address.street.trim(),
      number: address.number.trim(),
      complement: address.complement.trim(),
      neighborhood: address.neighborhood.trim(),
      city: address.city.trim(),
      state: address.state.trim().toUpperCase(),
    };

    const nextErrors = {
      cep: normalizedAddress.cep ? "" : "Informe o CEP.",
      street: normalizedAddress.street ? "" : "Informe a rua.",
      number: normalizedAddress.number ? "" : "Informe o número.",
      neighborhood: normalizedAddress.neighborhood ? "" : "Informe o bairro.",
      city: normalizedAddress.city ? "" : "Informe a cidade.",
      state:
        normalizedAddress.state.length === 2 ? "" : "Informe a UF com 2 letras.",
    };

    setErrors(nextErrors);

    if (
      nextErrors.cep ||
      nextErrors.street ||
      nextErrors.number ||
      nextErrors.neighborhood ||
      nextErrors.city ||
      nextErrors.state
    ) {
      return;
    }

    if (!user) {
      router.replace("/");
      return;
    }

    setSaving(true);
    setSuccessMessage("");

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          fullName: user.displayName || "",
          email: user.email || "",
          address: normalizedAddress,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      setAddress(normalizedAddress);
      setIsEditingAddress(false);
      setSuccessMessage("Endereço salvo com sucesso.");
    } catch (error) {
      console.log("ERRO AO SALVAR ENDERECO:", error);
      setSuccessMessage("Não foi possível salvar agora.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Meu Perfil</Text>
            <Text style={styles.subtitle}>
              Cadastre seu endereço para agilizar as próximas coletas.
            </Text>
          </View>

          <View style={styles.avatar}>
            <MaterialIcons name="person" size={26} color={COLORS.onPrimary} />
          </View>
        </View>

        <View style={styles.userCard}>
          <Text style={styles.userName}>{user?.displayName || "Usuário"}</Text>
          <Text style={styles.userEmail}>{user?.email || "email não informado"}</Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <MaterialIcons name="event-available" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.summaryValue}>{schedulesCount}</Text>
            <Text style={styles.summaryLabel}>Solicitações feitas</Text>
          </View>

     
        </View>

        {/* Nível e Progresso */}
        <LevelProgressBar levelInfo={getLevel(pointsBalance)} />

        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <MaterialIcons name="badge" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Dados da conta</Text>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>
                {profile?.fullName || user?.displayName || "Não informado"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>
                {profile?.email || user?.email || "Não informado"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cliente desde</Text>
              <Text style={styles.infoValue}>{memberSince}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Endereço padrão</Text>
              <Text style={styles.infoValue}>{addressSummary}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <MaterialIcons name="location-on" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Endereço de coleta</Text>
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : isAddressComplete && !isEditingAddress ? (
            <View style={styles.addressCard}>
              <TouchableOpacity
                style={styles.editAddressButton}
                activeOpacity={0.85}
                onPress={() => {
                  setSuccessMessage("");
                  setIsEditingAddress(true);
                }}
              >
                <MaterialIcons name="edit" size={14} color={COLORS.primary} />
                <Text style={styles.editAddressButtonText}>Editar</Text>
              </TouchableOpacity>

              <View style={styles.addressCardIcon}>
                <MaterialIcons name="home" size={24} color={COLORS.primary} />
              </View>

              <View style={styles.addressCardContent}>
                <Text style={styles.addressCardTitle}>
                  {address.street}, {address.number}
                </Text>
                <Text style={styles.addressCardText}>
                  {address.neighborhood} - {address.city}/{address.state}
                </Text>
                <Text style={styles.addressCardText}>CEP {address.cep}</Text>
                {address.complement ? (
                  <Text style={styles.addressCardComplement}>
                    Complemento: {address.complement}
                  </Text>
                ) : null}
              </View>

            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CEP</Text>
                <TextInput
                  style={[styles.input, errors.cep ? styles.inputError : null]}
                  placeholder="00000-000"
                  keyboardType="number-pad"
                  placeholderTextColor={COLORS.outline + "80"}
                  value={address.cep}
                  onChangeText={(value) => updateAddress("cep", value)}
                />
                {errors.cep ? <Text style={styles.errorText}>{errors.cep}</Text> : null}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>RUA / AVENIDA</Text>
                <TextInput
                  style={[styles.input, errors.street ? styles.inputError : null]}
                  placeholder="Ex: Rua das Flores"
                  placeholderTextColor={COLORS.outline + "80"}
                  value={address.street}
                  onChangeText={(value) => updateAddress("street", value)}
                />
                {errors.street ? (
                  <Text style={styles.errorText}>{errors.street}</Text>
                ) : null}
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, styles.numberInput]}>
                  <Text style={styles.label}>NÚMERO</Text>
                  <TextInput
                    style={[styles.input, errors.number ? styles.inputError : null]}
                    placeholder="123"
                    keyboardType="number-pad"
                    placeholderTextColor={COLORS.outline + "80"}
                    value={address.number}
                    onChangeText={(value) => updateAddress("number", value)}
                  />
                  {errors.number ? (
                    <Text style={styles.errorText}>{errors.number}</Text>
                  ) : null}
                </View>

                <View style={[styles.inputGroup, styles.complementInput]}>
                  <Text style={styles.label}>COMPLEMENTO</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Apto, bloco..."
                    placeholderTextColor={COLORS.outline + "80"}
                    value={address.complement}
                    onChangeText={(value) => updateAddress("complement", value)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>BAIRRO</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.neighborhood ? styles.inputError : null,
                  ]}
                  placeholder="Ex: Centro"
                  placeholderTextColor={COLORS.outline + "80"}
                  value={address.neighborhood}
                  onChangeText={(value) => updateAddress("neighborhood", value)}
                />
                {errors.neighborhood ? (
                  <Text style={styles.errorText}>{errors.neighborhood}</Text>
                ) : null}
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, styles.cityInput]}>
                  <Text style={styles.label}>CIDADE</Text>
                  <TextInput
                    style={[styles.input, errors.city ? styles.inputError : null]}
                    placeholder="São Paulo"
                    placeholderTextColor={COLORS.outline + "80"}
                    value={address.city}
                    onChangeText={(value) => updateAddress("city", value)}
                  />
                  {errors.city ? (
                    <Text style={styles.errorText}>{errors.city}</Text>
                  ) : null}
                </View>

                <View style={[styles.inputGroup, styles.stateInput]}>
                  <Text style={styles.label}>UF</Text>
                  <TextInput
                    style={[styles.input, errors.state ? styles.inputError : null]}
                    placeholder="SP"
                    autoCapitalize="characters"
                    maxLength={2}
                    placeholderTextColor={COLORS.outline + "80"}
                    value={address.state}
                    onChangeText={(value) => updateAddress("state", value)}
                  />
                  {errors.state ? (
                    <Text style={styles.errorText}>{errors.state}</Text>
                  ) : null}
                </View>
              </View>

              {successMessage ? (
                <Text
                  style={[
                    styles.feedbackText,
                    successMessage.includes("sucesso")
                      ? styles.feedbackSuccess
                      : styles.feedbackError,
                  ]}
                >
                  {successMessage}
                </Text>
              ) : null}

              <TouchableOpacity
                style={[styles.saveButton, saving ? styles.saveButtonDisabled : null]}
                activeOpacity={0.85}
                onPress={handleSaveAddress}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={COLORS.onPrimary} />
                ) : (
                  <>
                    <MaterialIcons name="save" size={18} color={COLORS.onPrimary} />
                    <Text style={styles.saveButtonText}>Salvar endereço</Text>
                  </>
                )}
              </TouchableOpacity>

              {isAddressComplete ? (
                <TouchableOpacity
                  style={styles.cancelEditButton}
                  activeOpacity={0.85}
                  onPress={() => {
                    setErrors({
                      cep: "",
                      street: "",
                      number: "",
                      neighborhood: "",
                      city: "",
                      state: "",
                    });
                    setSuccessMessage("");
                    setIsEditingAddress(false);
                  }}
                >
                  <Text style={styles.cancelEditButtonText}>Cancelar edição</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function formatMemberSince(createdAt?: UserProfile["createdAt"]) {
  const createdDate = createdAt?.toDate?.();

  if (!createdDate) {
    return "Não informado";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(createdDate);
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
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 24,
  },
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.onSurface,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Manrope-Regular",
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 280,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  userCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.outline + "12",
    marginBottom: 16,
  },
  userName: {
    fontFamily: "Manrope-Bold",
    color: COLORS.onSurface,
    fontSize: 18,
  },
  userEmail: {
    color: COLORS.onSurfaceVariant,
    fontSize: 13,
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.outline + "12",
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + "18",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  summaryValue: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 20,
    marginBottom: 4,
  },
  summaryLabel: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    lineHeight: 16,
  },
  infoCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.outline + "12",
    marginBottom: 16,
  },
  infoList: {
    gap: 14,
  },
  infoRow: {
    gap: 4,
  },
  infoLabel: {
    color: COLORS.onSurfaceVariant,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  infoValue: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.outline + "12",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  sectionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary + "18",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontFamily: "Manrope-Bold",
    color: COLORS.onSurface,
    fontSize: 16,
  },
  loadingBox: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  numberInput: {
    flex: 0.42,
  },
  complementInput: {
    flex: 0.58,
  },
  cityInput: {
    flex: 1,
  },
  stateInput: {
    width: 78,
  },
  label: {
    color: COLORS.onSurfaceVariant,
    fontSize: 10,
    letterSpacing: 1.2,
    paddingLeft: 4,
  },
  input: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.outline + "22",
    color: COLORS.onSurface,
    padding: 14,
  },
  inputError: {
    borderColor: "#FF7A7A",
  },
  errorText: {
    color: "#FF7A7A",
    fontSize: 12,
    marginLeft: 4,
  },
  feedbackText: {
    fontSize: 13,
    textAlign: "center",
  },
  feedbackSuccess: {
    color: COLORS.primary,
  },
  feedbackError: {
    color: "#FF7A7A",
  },
  saveButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: COLORS.onPrimary,
    fontFamily: "Manrope-Bold",
    fontSize: 15,
  },
  addressCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 16,
    padding: 16,
    paddingTop: 18,
    paddingRight: 82,
    borderWidth: 1,
    borderColor: COLORS.primary + "24",
    gap: 14,
    position: "relative",
  },
  addressCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary + "18",
    alignItems: "center",
    justifyContent: "center",
  },
  addressCardContent: {
    gap: 4,
  },
  addressCardTitle: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 18,
    lineHeight: 24,
  },
  addressCardText: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 13,
    lineHeight: 19,
  },
  addressCardComplement: {
    color: COLORS.primary,
    fontFamily: "Manrope-Regular",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  editAddressButton: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  editAddressButtonText: {
    color: COLORS.primary,
    fontFamily: "Manrope-Bold",
    fontSize: 12,
  },
  cancelEditButton: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.outline + "22",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelEditButtonText: {
    color: COLORS.onSurface,
    fontFamily: "Manrope-Bold",
    fontSize: 14,
  },
});
