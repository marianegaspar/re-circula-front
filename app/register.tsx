import { MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  doc,
  setDoc
} from "firebase/firestore";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useAppFonts } from "../hooks/use-App-Fonts";
import { auth, db } from "../src/services/firebase";
import { COLORS } from "./themes";


export const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path
      fill="#fbc02d"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <Path
      fill="#e53935"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <Path
      fill="#4caf50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <Path
      fill="#1565c0"
      d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </Svg>
);

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { fontsLoaded } = useAppFonts();

  if (!fontsLoaded) {
    return null; // O App fica travado na Splash Screen até as fontes estarem prontas
  }

async function handleRegister() {
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
    fullName: fullName.trim()
      ? ""
      : "Preencha este campo.",

    email: email.trim()
      ? ""
      : "Preencha este campo.",

    password: password.trim()
      ? ""
      : "Preencha este campo.",

    confirmPassword: confirmPassword.trim()
      ? confirmPassword.trim() !== password.trim()
        ? "As senhas precisam ser iguais."
        : ""
      : "Preencha este campo.",
  };

  setErrors(nextErrors);

  // Se houver erros, para aqui
  if (
    nextErrors.fullName ||
    nextErrors.email ||
    nextErrors.password ||
    nextErrors.confirmPassword
  ) {
    return;
  }

  try {

      console.log("CRIANDO USUARIO");

const userCredential =
  await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

    console.log("USUARIO AUTH CRIADO");

  await updateProfile(
  userCredential.user,
  {
    displayName: fullName,
  }
);

  console.log("SALVANDO FIRESTORE");


//cria o documento do usuário no Firestore
await setDoc(
  doc(db, "users", userCredential.user.uid),
  {
    fullName,
    email,
    address: normalizedAddress,
    createdAt: new Date(),
  }
);
  console.log("FIRESTORE SALVO");

    router.replace("/home");

  } catch (error: any) {

    if (error.code === "auth/email-already-in-use") {

      setErrors({
        ...nextErrors,
        email: "Este email já está em uso.",
      });

      return;
    }

    if (error.code === "auth/invalid-email") {

      setErrors({
        ...nextErrors,
        email: "Email inválido.",
      });

      return;
    }

    if (error.code === "auth/weak-password") {

      setErrors({
        ...nextErrors,
        password: "A senha precisa ter pelo menos 6 caracteres.",
      });

      return;
    }

    console.log(error);

    
  }
}
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoText}>Recircula</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.heroTitle}>
              Alimente o <Text style={{ color: COLORS.primary }}>Fluxo</Text>.
            </Text>
            <Text style={styles.heroSubtitle}>
              Junte-se à maior rede de economia circular tecnológica e
              transforme resíduos em impacto real.
            </Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.cardTitle}>Criar conta</Text>
            <Text style={styles.cardSubtitle}>
              Comece sua jornada sustentável hoje.
            </Text>
          </View>

          <View style={styles.form}>
            {/* Nome Completo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NOME COMPLETO</Text>
              <TextInput
                style={[styles.input, errors.fullName ? styles.inputError : null]}
                placeholder="Ex: João Silva"
                placeholderTextColor={COLORS.outline + "80"}
                value={fullName}
                onChangeText={(value) => {
                  setFullName(value);
                  if (errors.fullName) {
                    setErrors((current) => ({ ...current, fullName: "" }));
                  }
                }}
              />
              {errors.fullName ? (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              ) : null}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-MAIL</Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                placeholder="nome@email.com"
                keyboardType="email-address"
                placeholderTextColor={COLORS.outline + "80"}
                autoCapitalize="none"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (errors.email) {
                    setErrors((current) => ({ ...current, email: "" }));
                  }
                }}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>SENHA</Text>
              <View
                style={[
                  styles.passwordWrapper,
                  errors.password ? styles.inputError : null,
                ]}
              >
                <TextInput
                  style={styles.inputPassword}
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  placeholderTextColor={COLORS.outline + "80"}
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setErrors((current) => ({
                      ...current,
                      password: "",
                      confirmPassword:
                        confirmPassword.trim() && value.trim() !== confirmPassword.trim()
                          ? "As senhas precisam ser iguais."
                          : "",
                    }));
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color={COLORS.outline}
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            {/* Confirmar Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONFIRMAR SENHA</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.confirmPassword ? styles.inputError : null,
                ]}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                placeholderTextColor={COLORS.outline + "80"}
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  setErrors((current) => ({
                    ...current,
                    confirmPassword:
                      value.trim() && password.trim() !== value.trim()
                        ? "As senhas precisam ser iguais."
                        : "",
                  }));
                }}
              />
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.8}
              onPress={handleRegister}
            >
              <Text style={styles.btnPrimaryText}>Criar conta</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.btnGoogle} activeOpacity={0.7}>
              <GoogleIcon size={20} />
              <Text style={styles.btnGoogleText}>Cadastrar com Google</Text>
            </TouchableOpacity>

            <View style={styles.footerLink}>
              <Text style={styles.footerText}>Já tem uma conta? </Text>
              <Link href="/" asChild>
                <TouchableOpacity>
                  <Text style={styles.signUpText}>Entrar</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>

        {/* Metrics Section */}
        <View style={styles.metricsGrid}>
          <View
            style={[
              styles.metricCard,
              styles.leafLeft,
              { borderLeftColor: COLORS.primaryContainer },
            ]}
          >
            <View style={styles.metricHeader}>
              <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
              <Text style={[styles.metricLabel, { color: COLORS.primary }]}>
                REDUZIDO
              </Text>
            </View>
            <Text style={styles.metricValue}>14.2t</Text>
            <Text style={styles.metricSub}>CO2 evitados</Text>
          </View>

          <View
            style={[
              styles.metricCard,
              styles.leafRight,
              { borderLeftColor: COLORS.secondary },
            ]}
          >
            <View style={styles.metricHeader}>
              <View
                style={[styles.dot, { backgroundColor: COLORS.secondary }]}
              />
              <Text style={[styles.metricLabel, { color: COLORS.secondary }]}>
                RECICLADO
              </Text>
            </View>
            <Text style={styles.metricValue}>850kg</Text>
            <Text style={styles.metricSub}>Lixo eletrônico</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: "center",
  },
  glowTop: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.primary + "10", // 10% opacidade
  },
  glowBottom: {
    position: "absolute",
    bottom: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.primaryContainer + "15",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  logoText: {
    fontFamily: "Manrope-Bold",
    fontSize: 24,
    color: COLORS.primary,
    letterSpacing: -1,
  },

  titleContainer: {
    marginTop: 24,
    alignItems: "center",
  },

  heroTitle: {
    fontFamily: "Manrope-Bold",
    fontSize: 36,
    color: COLORS.onSurface,
    textAlign: "center",
    lineHeight: 42,
  },

  heroSubtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: COLORS.surfaceContainer + "95", // Backdrop blur fake
    width: "100%",
    borderRadius: 40,
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  cardTitle: {
    fontFamily: "Manrope-Bold",
    fontSize: 24,
    color: COLORS.onSurface,
  },

  cardSubtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    marginTop: 4,
  },
  form: {
    marginTop: 32,
    gap: 20,
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
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1.5,
    paddingLeft: 4,
  },
  input: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    color: COLORS.onSurface,

    borderWidth: 1,
    borderColor: COLORS.outline + "20",
  },
  inputError: {
    borderColor: "#FF7A7A",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.outline + "20",
  },
  inputPassword: {
    flex: 1,
    height: 56,
    color: COLORS.onSurface,
  },
  errorText: {
    color: "#FF7A7A",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  addressSection: {
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.outline + "20",
    paddingTop: 20,
  },
  sectionHeaderInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addressTitle: {
    fontFamily: "Manrope-Bold",
    color: COLORS.onSurface,
    fontSize: 16,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  btnPrimaryText: {
    fontFamily: "Manrope-Bold",
    color: COLORS.onPrimary,
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.outline + "20",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 10,

    color: COLORS.onSurfaceVariant,
  },
  btnGoogle: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceContainerLowest,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.outline + "20",
  },
  btnGoogleText: {
    color: COLORS.onSurface,
    fontSize: 14,
  },
  footerLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  footerText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
  },
  signUpText: {
    color: COLORS.primary,

    fontSize: 14,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 16,
    marginTop: 32,
    width: "100%",
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 20,
    borderLeftWidth: 2,
  },
  leafLeft: {
    borderTopLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  leafRight: {
    borderTopLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  metricLabel: {
    fontSize: 9,

    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 24,

    color: COLORS.onSurface,
  },
  metricSub: {
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
  },
});
