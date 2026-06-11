import { Link, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAppFonts } from "../hooks/use-App-Fonts";
import { auth } from "../src/services/firebase";
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const { fontsLoaded } = useAppFonts();

  if (!fontsLoaded) {
    return null; // O App fica travado na Splash Screen até as fontes estarem prontas
  }


async function entrar() {

  const nextErrors = {
    email: email.trim() ? "" : "Preencha este campo.",
    password: password.trim()
      ? ""
      : "Preencha este campo.",
  };

  setErrors(nextErrors);

  // Se houver erro, para aqui
  if (nextErrors.email || nextErrors.password) {
    return;
  }

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    router.replace("/home");

  } catch (error) {

    setErrors({
      email: "",
      password: "Email ou senha inválidos.",
    });

  }
}


  return (
    <View style={style.container}>
      {/* Header */}
      <View style={style.header}>
        <MaterialIcons name="bolt" size={28} color={COLORS.primary} />
        <Text style={style.logoText}> ReCircula </Text>
      </View>
      {/* Login Card */}
      <View style={style.card}>
        <View style={style.cardHeader}>
          <Text style={style.title}>Bem-vindo de volta</Text>
          <Text style={style.subtitle}>
            Acesse sua conta para continuar sua jornada sustentável.
          </Text>

          {/* Form */}
          <View style={style.form}>
            {/* Email */}
            <Text style={style.label}>E-MAIL</Text>
            <View
              style={[
                style.inputContainer,
                errors.email ? style.inputError : null,
              ]}
            >
              <MaterialIcons
                name="mail-outline"
                size={20}
                color={COLORS.outline}
                style={style.inputIcon}
              />
              <TextInput
                style={style.input}
                placeholder="seu@email.com"
                placeholderTextColor={COLORS.outline + "70"}
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (errors.email) {
                    setErrors((current) => ({ ...current, email: "" }));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email ? (
              <Text style={style.errorText}>{errors.email}</Text>
            ) : null}
          </View>
          {/* Password */}
          <View style={style.labelRow}>
            <Text style={style.label}>SENHA</Text>
            <TouchableOpacity>
              <Text style={style.forgotPassword}>ESQUECI MINHA SENHA</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 8 }} />
          <View
            style={[
              style.inputContainer,
              errors.password ? style.inputError : null,
            ]}
          >
            <MaterialIcons
              name="lock-outline"
              size={20}
              color={COLORS.outline}
              style={style.inputIcon}
            />
            <TextInput
              style={style.input}
              placeholder="••••••••"
              placeholderTextColor={COLORS.outline + "70"}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (errors.password) {
                  setErrors((current) => ({ ...current, password: "" }));
                }
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={20}
                color={COLORS.outline}
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={style.errorText}>{errors.password}</Text>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity activeOpacity={0.8} onPress={entrar}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={style.submitButton}
            >
              <Text style={style.submitButtonText}>Entrar</Text>
            </LinearGradient>
          </TouchableOpacity>
            <Text style={[style.footerText,
              {marginTop:12,}
            ]}>Conta de Teste: usuario@teste.com / 
              senha: teste123
            </Text>
        </View>
        {/* Divider */}
        <View style={style.dividerContainer}>
          <View style={style.dividerLine} />
          <Text style={style.dividerText}>OU</Text>
          <View style={style.dividerLine} />
        </View>
        {/* Social Login */}
        <View style={style.socialGrid}>
          <TouchableOpacity style={style.socialButton} activeOpacity={0.7}>
            <GoogleIcon size={20} />
            <Text style={style.socialText}>Cadastrar com Google</Text>
          </TouchableOpacity>
        </View>
        {/* Footer Link */}
        <View style={style.footerLink}>
          <Text style={style.footerText}>Não tem uma conta?</Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={style.signUpText}> Cadastre-se</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  decorCircle: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  card: {
    backgroundColor: COLORS.surfaceContainerLowest,
    width: "100%",
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  cardHeader: {
    marginBottom: 32,
  },
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.onSurface,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
    letterSpacing: 1.5,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  forgotPassword: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#FF7A7A",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: COLORS.onSurface,
    fontSize: 16,
  },
  errorText: {
    color: "#FF7A7A",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: COLORS.onPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  dividerText: {
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    paddingHorizontal: 12,
    letterSpacing: 2,
  },
  socialGrid: {
    width: "100%",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    height: 56,
    gap: 8,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  socialText: {
    color: COLORS.onSurface,
    fontWeight: "600",
    fontSize: 14,
  },
  footerLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: {
    color: COLORS.onSurfaceVariant,
    fontSize: 14,
  },
  signUpText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
});
