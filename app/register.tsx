import { MaterialIcons } from "@expo/vector-icons";
import { Link } from 'expo-router';
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useAppFonts } from "../hooks/use-App-Fonts";
import { styles } from "./register-styles";
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
    const [showPassword, setShowPassword] = useState(false);
      const { fontsLoaded } = useAppFonts();
    
      if (!fontsLoaded) {
        return null; // O App fica travado na Splash Screen até as fontes estarem prontas
      }
    
    return(
    <View style={styles.container}>


      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}  
        <View style={styles.header}>
          <Text style={styles.logoText}>Recircula</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.heroTitle}>
              Alimente o <Text style={{ color: COLORS.primary }}>Fluxo</Text>.
            </Text>
            <Text style={styles.heroSubtitle}>
              Junte-se à maior rede de economia circular tecnológica e transforme resíduos em impacto real.
            </Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.cardTitle}>Criar conta</Text>
            <Text style={styles.cardSubtitle}>Comece sua jornada sustentável hoje.</Text>
          </View>

          <View style={styles.form}>
            {/* Nome Completo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NOME COMPLETO</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: João Silva" 
                placeholderTextColor={COLORS.outline + '80'}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-MAIL</Text>
              <TextInput 
                style={styles.input} 
                placeholder="nome@email.com" 
                keyboardType="email-address"
                placeholderTextColor={COLORS.outline + '80'}
              />
            </View>

            {/* Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>SENHA</Text>
              <View style={styles.passwordWrapper}>
                <TextInput 
                  style={styles.inputPassword} 
                  placeholder="••••••••" 
                  secureTextEntry={!showPassword}
                  placeholderTextColor={COLORS.outline + '80'}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color={COLORS.outline} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirmar Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONFIRMAR SENHA</Text>
              <TextInput 
                style={styles.input} 
                placeholder="••••••••" 
                secureTextEntry={!showPassword}
                placeholderTextColor={COLORS.outline + '80'}
              />
            </View>

            <Link href ="/home" asChild>
            <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.8}>
             
              <Text style={styles.btnPrimaryText}>Criar conta</Text>
          
            </TouchableOpacity> 
            </Link>

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
              <Link href="/home" asChild>
                <TouchableOpacity>
                  <Text style={styles.signUpText}>Entrar</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>

        {/* Metrics Section */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, styles.leafLeft, { borderLeftColor: COLORS.primaryContainer }]}>
            <View style={styles.metricHeader}>
              <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
              <Text style={[styles.metricLabel, { color: COLORS.primary }]}>REDUZIDO</Text>
            </View>
            <Text style={styles.metricValue}>14.2t</Text>
            <Text style={styles.metricSub}>CO2 evitados</Text>
          </View>

          <View style={[styles.metricCard, styles.leafRight, { borderLeftColor: COLORS.secondary }]}>
            <View style={styles.metricHeader}>
              <View style={[styles.dot, { backgroundColor: COLORS.secondary }]} />
              <Text style={[styles.metricLabel, { color: COLORS.secondary }]}>RECICLADO</Text>
            </View>
            <Text style={styles.metricValue}>850kg</Text>
            <Text style={styles.metricSub}>Lixo eletrônico</Text>
          </View>
        </View>
</ScrollView>
    </View>
            
    );   
   
    
}   