import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
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
import { WebContainer } from "../components/WebContainer";
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
        setIsEditingAddress(false);
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
  const displayName = profile?.fullName || user?.displayName || "Usuário";
  const displayEmail = profile?.email || user?.email || "email não informado";
  const initials = getInitials(displayName);
  const levelInfo = getLevel(pointsBalance);
  const impactKg = Math.max(schedulesCount * 0.6, pointsBalance * 0.01);

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

  async function handleSignOut() {
    await signOut(auth);
    router.replace("/");
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <WebContainer style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>

          <TouchableOpacity style={styles.settingsButton} activeOpacity={0.85}>
            <MaterialIcons name="settings" size={18} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{displayEmail}</Text>
            <View style={styles.memberPill}>
              <MaterialIcons name="calendar-today" size={10} color={COLORS.onSurfaceVariant} />
              <Text style={styles.memberPillText}>Desde {memberSince}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editProfileButton} activeOpacity={0.85}>
            <MaterialIcons name="edit" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <MaterialIcons name="arrow-upward" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.summaryValue}>{schedulesCount}</Text>
            <Text style={styles.summaryLabel}>Solicitações feitas</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, styles.summaryIconBlue]}>
              <MaterialIcons name="eco" size={16} color={COLORS.blue} />
            </View>
            <Text style={styles.summaryValue}>{impactKg.toFixed(1)}<Text style={styles.summaryUnit}>kg</Text></Text>
            <Text style={styles.summaryLabel}>Lixo evitado</Text>
          </View>
        </View>

        <View style={styles.pointsCard}>
          <View style={styles.pointsGlow} />
          <View style={styles.pointsHeader}>
            <View>
              <Text style={styles.pointsValue}>{pointsBalance}</Text>
              <Text style={styles.pointsLabel}>pontos acumulados</Text>
            </View>
            <View style={styles.levelPill}>
              <Text style={styles.levelPillText}>
                {levelInfo.emoji} {levelInfo.name}
              </Text>
            </View>
          </View>

          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(100, levelInfo.progress)}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {levelInfo.pointsNeeded} pts {">"} {levelInfo.nextLevel?.name || "topo"}
            </Text>
          </View>
        </View>

        {!isAddressComplete && !isEditingAddress ? (
          <TouchableOpacity
            style={styles.addressWarningCard}
            activeOpacity={0.85}
            onPress={() => setIsEditingAddress(true)}
          >
            <MaterialIcons name="warning-amber" size={18} color="#FBBF24" />
            <View style={styles.addressWarningText}>
              <Text style={styles.addressWarningTitle}>Endereço não cadastrado</Text>
              <Text style={styles.addressWarningSubtitle}>
                Necessário para agendar coletas
              </Text>
            </View>
            <Text style={styles.addressWarningAction}>Adicionar →</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.infoCard}>
          <Text style={styles.sectionEyebrow}>DADOS DA CONTA</Text>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>{displayName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{displayEmail}</Text>
            </View>

            <TouchableOpacity
              style={styles.infoRow}
              activeOpacity={0.85}
              onPress={() => setIsEditingAddress(true)}
            >
              <Text style={styles.infoLabel}>Endereço padrão</Text>
              <View style={styles.infoValueRow}>
                <Text style={styles.infoValue}>{isAddressComplete ? addressSummary : "Não cadastrado"}</Text>
                <Text style={styles.addInlineText}>{isAddressComplete ? "Editar" : "+ Adicionar"}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {isAddressComplete && !isEditingAddress ? (
          <View style={styles.addressDisplayCard}>
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
              <MaterialIcons name="home" size={22} color={COLORS.primary} />
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
        ) : null}

        {isEditingAddress ? (
        <View style={styles.card}>
          <Text style={styles.sectionEyebrow}>ENDEREÇO DE COLETA</Text>
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={COLORS.primary} />
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
        ) : null}

        <TouchableOpacity
          style={styles.signOutButton}
          activeOpacity={0.85}
          onPress={handleSignOut}
        >
          <MaterialIcons name="logout" size={16} color="#FF6B6B" />
          <Text style={styles.signOutText}>Sair da conta</Text>
        </TouchableOpacity>
      </WebContainer>
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

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "U";
  const second = parts.length > 1 ? parts[parts.length - 1][0] : "";

  return `${first}${second}`.toUpperCase();
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 22,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 22,
    fontWeight: "800",
    color: "#F2F6FF",
  },
  settingsButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: "#223652",
    alignItems: "center",
    justifyContent: "center",
  },
  userCard: {
    minHeight: 100,
    backgroundColor:COLORS.surfaceContainer,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#223652",
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.onPrimary,
    fontFamily: "Manrope-Bold",
    fontSize: 22,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: "Manrope-Bold",
    color: "#F2F6FF",
    fontSize: 18,
    lineHeight: 22,
  },
  userEmail: {
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
    marginTop: 2,
  },
  memberPill: {
    alignSelf: "flex-start",
    marginTop: 10,
    borderRadius: 999,
    backgroundColor:  COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: "#223652",
    paddingHorizontal: 9,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  memberPillText: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 10,
  },
  editProfileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor:  COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: "#223652",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    minHeight: 106,
    backgroundColor:  COLORS.surfaceContainer,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#223652",
    justifyContent: "space-between",
  },
  summaryIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: COLORS.primary + "18",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryIconBlue: {
    backgroundColor: COLORS.blue + "18",
  },
  summaryValue: {
    color: "#F2F6FF",
    fontFamily: "Manrope-Bold",
    fontSize: 22,
    lineHeight: 24,
  },
  summaryUnit: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  summaryLabel: {
    color: "#6F839D",
    fontFamily: "Manrope-Regular",
    fontSize: 11,
    lineHeight: 16,
  },
  pointsCard: {
    backgroundColor: "#20C77C",
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    minHeight: 130,
    overflow: "hidden",
  },
  pointsGlow: {
    position: "absolute",
    right: -16,
    bottom: -18,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  pointsHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  pointsValue: {
    color: "#FFFFFF",
    fontFamily: "Manrope-Bold",
    fontSize: 36,
    lineHeight: 38,
  },
  pointsLabel: {
    color: "rgba(255,255,255,0.86)",
    fontFamily: "Manrope-Bold",
    fontSize: 12,
  },
  levelPill: {
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  levelPillText: {
    color: "#FFFFFF",
    fontFamily: "Manrope-Bold",
    fontSize: 11,
  },
  progressRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.45)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  progressText: {
    color: "#FFFFFF",
    fontFamily: "Manrope-Bold",
    fontSize: 11,
  },
  addressWarningCard: {
    minHeight: 66,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.42)",
    backgroundColor: "rgba(251,191,36,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addressWarningText: {
    flex: 1,
  },
  addressWarningTitle: {
    color: "#F2F6FF",
    fontFamily: "Manrope-Bold",
    fontSize: 13,
  },
  addressWarningSubtitle: {
    color: COLORS.onSurfaceVariant,
    fontFamily: "Manrope-Regular",
    fontSize: 11,
    marginTop: 2,
  },
  addressWarningAction: {
    color: "#FBBF24",
    fontFamily: "Manrope-Bold",
    fontSize: 12,
  },
  sectionEyebrow: {
    color: "#526882",
    fontFamily: "Manrope-Bold",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor:  COLORS.surfaceContainer,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#223652",
    marginBottom: 12,
    overflow: "hidden",
  },
  infoList: {
    borderTopWidth: 1,
    borderTopColor: "transparent",
  },
  infoRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#223652",
    gap: 5,
  },
  infoLabel: {
    color: "#526882",
    fontFamily: "Manrope-Bold",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  infoValue: {
    color: "#F2F6FF",
    fontFamily: "Manrope-Bold",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  infoValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addInlineText: {
    color: COLORS.primary,
    fontFamily: "Manrope-Bold",
    fontSize: 12,
  },
  card: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#223652",
    marginBottom: 12,
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
    color: "#6F839D",
    fontFamily: "Manrope-Bold",
    fontSize: 10,
    letterSpacing: 1.2,
    paddingLeft: 4,
  },
  input: {
    backgroundColor: "#0E1A2D",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#223652",
    color: "#F2F6FF",
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
    borderRadius: 14,
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
  addressDisplayCard: {
    backgroundColor: "#132238",
    borderRadius: 16,
    padding: 16,
    paddingTop: 18,
    paddingRight: 82,
    borderWidth: 1,
    borderColor: "#223652",
    gap: 14,
    position: "relative",
    marginBottom: 12,
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
    color: "#F2F6FF",
    fontFamily: "Manrope-Bold",
    fontSize: 16,
    lineHeight: 22,
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
    borderColor: "#223652",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelEditButtonText: {
    color: "#F2F6FF",
    fontFamily: "Manrope-Bold",
    fontSize: 14,
  },
  signOutButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#132238",
    borderWidth: 1,
    borderColor: "#223652",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  signOutText: {
    color: "#FF6B6B",
    fontFamily: "Manrope-Bold",
    fontSize: 14,
  },
});
