import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { style } from "./styles";
import { COLORS } from "./themes";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={style.container}>
      {/* Header */}
      <View style={style.header}>
        <MaterialIcons name="eco" size={28} color={COLORS.primary} />
        <Text style={style.logoText}> ReCircula </Text>
      </View>

      {/* Login Card */}
      <View style={style.card}>
        <View style={style.cardHeader}>
          <Text style={style.title}>Bem-vindo de volta</Text>
          <Text style={style.subtitle}>
            Acesse sua conta para continuar sua jornada sustentável.
          </Text>
        </View>

        {/* Form */}
        <View style={style.form}>
          {/* Email */}
          <Text style={style.label}>E-MAIL</Text>
          <View style={style.inputContainer}>
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
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
        {/* Password */}
        <View style={style.labelRow}>
          <Text style={style.label}>SENHA</Text>
          <TouchableOpacity>
            <Text style={style.forgotPassword}>ESQUECI MINHA SENHA</Text>
          </TouchableOpacity>
        </View>
        <div style={{ height: 8 }} />
        <View style={style.inputContainer}>
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
            onChangeText={setPassword}
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

        {/* Submit Button */}
        <TouchableOpacity activeOpacity={0.8}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={style.submitButton}
          >
            <Text style={style.submitButtonText}>Entrar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={style.dividerContainer}>
        <View style={style.dividerLine} />
        <Text style={style.dividerText}>ou</Text>
        <View style={style.dividerLine} />
      </View>

      {/* Social Login */}
      <TouchableOpacity style={style.socialButton}>
        <MaterialIcons
          name="google"
          size={20}
          color={COLORS.onSurface}
          style={style.socialIcon}
        />
        <Text style={style.socialText}>Cadastrar com Google</Text>
      </TouchableOpacity>

      {/* Footer Link */}
      <View style={style.footerLink}>
        <Text style={style.footerText}>Não tem uma conta?</Text>
        <TouchableOpacity>
          <Text style={style.signUpText}> Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
