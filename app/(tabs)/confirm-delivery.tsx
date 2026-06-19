import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  collection,
  doc,
  increment,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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

type Feedback = {
  type: "success" | "error";
  message: string;
} | null;

function normalizeValidationCode(value: string) {
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

  if (cleaned.startsWith("RC")) {
    return `RC-${cleaned.slice(2, 10)}`;
  }

  return cleaned.slice(0, 11);
}

export default function ConfirmDeliveryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ validationCode?: string }>();
  const { fontsLoaded } = useAppFonts();
  const [validationCode, setValidationCode] = React.useState(() =>
    normalizeValidationCode(params.validationCode || ""),
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<Feedback>(null);

  async function handleConfirmDelivery() {
    const user = auth.currentUser;
    const normalizedCode = normalizeValidationCode(validationCode);

    setValidationCode(normalizedCode);
    setFeedback(null);

    if (!user) {
      setFeedback({
        type: "error",
        message: "Faça login para confirmar uma entrega.",
      });
      return;
    }

    if (!/^RC-\d{4,8}$/.test(normalizedCode)) {
      setFeedback({
        type: "error",
        message: "Digite um código válido no formato RC-4837.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduleSnapshot = await getDocs(
        query(
          collection(db, "schedules"),
          where("validationCode", "==", normalizedCode),
          where("userId", "==", user.uid),
          limit(1),
        ),
      );

      if (scheduleSnapshot.empty) {
        throw new Error("invalid-code");
      }

      const scheduleRef = scheduleSnapshot.docs[0].ref;
      const result = await runTransaction(db, async (transaction) => {
        const scheduleDocument = await transaction.get(scheduleRef);

        if (!scheduleDocument.exists()) {
          throw new Error("invalid-code");
        }

        const schedule = scheduleDocument.data();

        if (schedule.userId !== user.uid) {
          throw new Error("invalid-code");
        }

        if (schedule.deliveryType !== "collection_point") {
          throw new Error("invalid-code");
        }

        if (schedule.pointsGranted === true) {
          throw new Error("points-already-granted");
        }

        const ecoPoints = Number(schedule.ecoPoints || 0);

        if (ecoPoints <= 0) {
          throw new Error("invalid-points");
        }

        const userRef = doc(db, "users", user.uid);

        transaction.update(scheduleRef, {
          status: "completed",
          pointsGranted: true,
          completedAt: serverTimestamp(),
        });
        transaction.set(
          userRef,
          {
            pointsBalance: increment(ecoPoints),
            lastAwardedSchedule: scheduleRef.id,
            lastAwardedAt: serverTimestamp(),
          },
          { merge: true },
        );

        return ecoPoints;
      });

      setFeedback({
        type: "success",
        message: `Entrega confirmada! ${result} ecopontos foram adicionados à sua conta.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      if (message === "points-already-granted") {
        setFeedback({
          type: "error",
          message: "Esta coleta já foi validada e os pontos já foram liberados.",
        });
      } else if (message === "invalid-points") {
        setFeedback({
          type: "error",
          message: "A coleta não possui uma pontuação válida.",
        });
      } else {
        setFeedback({
          type: "error",
          message: "Código não encontrado. Confira os dados e tente novamente.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <WebContainer style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={COLORS.onSurface}
            />
          </TouchableOpacity>

          <View style={styles.iconBadge}>
            <MaterialIcons name="verified" size={34} color={COLORS.onPrimary} />
          </View>

          <Text style={styles.title}>Confirmar Entrega</Text>
          <Text style={styles.subtitle}>
            Digite o código gerado para sua entrega no ponto de coleta e libere
            os ecopontos após a validação.
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>CÓDIGO DE VALIDAÇÃO</Text>
            <TextInput
              value={validationCode}
              onChangeText={(value) => {
                setValidationCode(normalizeValidationCode(value));
                setFeedback(null);
              }}
              placeholder="RC-4837"
              placeholderTextColor={COLORS.outline}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={11}
              editable={!isSubmitting}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={handleConfirmDelivery}
            />

            {feedback ? (
              <View
                style={[
                  styles.feedback,
                  feedback.type === "success"
                    ? styles.successFeedback
                    : styles.errorFeedback,
                ]}
              >
                <MaterialIcons
                  name={
                    feedback.type === "success"
                      ? "check-circle"
                      : "error-outline"
                  }
                  size={20}
                  color={feedback.type === "success" ? COLORS.primary : "#FCA5A5"}
                />
                <Text
                  style={[
                    styles.feedbackText,
                    feedback.type === "success"
                      ? styles.successFeedbackText
                      : styles.errorFeedbackText,
                  ]}
                >
                  {feedback.message}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[
                styles.confirmButton,
                isSubmitting && styles.confirmButtonDisabled,
              ]}
              activeOpacity={0.9}
              disabled={isSubmitting}
              onPress={handleConfirmDelivery}
            >
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.onPrimary} />
              ) : (
                <>
                  <Text style={styles.confirmButtonText}>Validar código</Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={18}
                    color={COLORS.onPrimary}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <MaterialIcons name="info-outline" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Para esta demonstração, o código substitui a validação feita por
              um operador no ponto de entrega.
            </Text>
          </View>
        </WebContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
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
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceContainer,
    marginBottom: 28,
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    color: COLORS.onSurface,
    fontSize: 30,
    lineHeight: 38,
    fontFamily: "Manrope-Bold",
  },
  subtitle: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Manrope-Regular",
    marginTop: 10,
    marginBottom: 28,
  },
  formCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  label: {
    color: COLORS.onSurfaceVariant,
    fontSize: 10,
    letterSpacing: 1.1,
    fontFamily: "Manrope-Bold",
    marginBottom: 9,
  },
  input: {
    height: 58,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surfaceContainerLow,
    color: COLORS.onSurface,
    fontSize: 22,
    letterSpacing: 2,
    fontFamily: "Manrope-Bold",
    paddingHorizontal: 16,
  },
  feedback: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  successFeedback: {
    backgroundColor: "rgba(78, 222, 163, 0.10)",
  },
  errorFeedback: {
    backgroundColor: "rgba(248, 113, 113, 0.10)",
  },
  feedbackText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Manrope-Regular",
  },
  successFeedbackText: {
    color: COLORS.primary,
  },
  errorFeedbackText: {
    color: "#FCA5A5",
  },
  confirmButton: {
    height: 54,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 18,
  },
  confirmButtonDisabled: {
    opacity: 0.65,
  },
  confirmButtonText: {
    color: COLORS.onPrimary,
    fontSize: 15,
    fontFamily: "Manrope-Bold",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(78, 222, 163, 0.08)",
    borderRadius: 12,
    padding: 14,
    marginTop: 18,
  },
  infoText: {
    flex: 1,
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Manrope-Regular",
  },
});
