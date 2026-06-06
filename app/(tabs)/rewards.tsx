import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAppFonts } from "../../hooks/use-App-Fonts";
import { COLORS } from "../themes";

export default function Rewards() {
    
  const { fontsLoaded } = useAppFonts();
   const [schedules, setSchedules] = React.useState<any[]>([]);
    const totalPoints = schedules.reduce(
    (sum, schedule) => sum + Number(schedule.ecoPoints || 0),
    0
  );


  if (!fontsLoaded) {
    return null; // Ou um componente de carregamento
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Programa de Incentivos</Text>
      <Text style={styles.subtitle}> Transforme seus Ecopontos em recompensas!</Text>

    {/* Bento Grid: Resumo */}
        <View style={styles.bentoGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryColumn}>
              <View style={styles.summaryIconWrap}>
                <MaterialIcons
                  name="stars"
                  size={22}
                  color={COLORS.onPrimary}
                />
              </View>
              <Text style={styles.summaryValue}>{totalPoints}</Text>
              <Text style={styles.summaryLabel}>Pontos</Text>
            </View>
            <MaterialIcons
              name="recycling"
              size={92}
              color="rgba(0, 56, 36, 0.12)"
              style={styles.summaryBgIcon}
            />
        
          </View>

    </View>

      <View style={styles.rewardsList}>
        <text style={styles.rewardHeader}>Recompensas Disponíveis</text>

        {/*Card 1*/}
        <TouchableOpacity style={styles.rewardCard}>
            
        <Image source={require("../../assets/images/gift-card.jpg")} 
        style={{ width: "100%", height: 120, borderRadius: 8 }} />

        <View style={styles.rewardContent}>
          <Text style={styles.rewardTitle}>Vale Presente</Text>
          <Text style={styles.rewardDescription}>
            Resgate vouchers para suas lojas favoritas. 
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10,justifyContent: "space-between" }}>
        <Text style={styles.rewardPoints}>800 Pontos</Text>
        
        <View style={styles.rewardButton}>
        <Text style = {styles.rewardCta}>Resgatar</Text>
        </View>
        </View>
        </View>
        </TouchableOpacity>

        {/*Card 2*/}
        <TouchableOpacity style={styles.rewardCard}>
            
        <Image source={require("../../assets/images/reward1.png")} 
        style={{ width: "100%", height: 120, borderRadius: 8 }} />

        <View style={styles.rewardContent}>
          <Text style={styles.rewardTitle}>Desconto Reparo</Text>
          <Text style={styles.rewardDescription}>
            20% off em assistência técnica autorizada.
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10,justifyContent: "space-between" }}>
        <Text style={styles.rewardPoints}>1200 Pontos</Text>
        
        <View style={styles.rewardButton}>
        <Text style = {styles.rewardCta}>Resgatar</Text>
        </View>
        </View>
        </View>
        </TouchableOpacity>


        {/*Card 3*/}
        <TouchableOpacity style={styles.rewardCard}>
            
        <Image source={require("../../assets/images/reward2.jpeg")} 
        style={{ width: "100%", height: 120, borderRadius: 8 }} />

        <View style={styles.rewardContent}>
          <Text style={styles.rewardTitle}>EcoCloud</Text>
          <Text style={styles.rewardDescription}>
            Armazenamento em nuvem carbono neutro.
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10,justifyContent: "space-between" }}>
        <Text style={styles.rewardPoints}>500 Pontos</Text>
        
        <View style={styles.rewardButton}>
        <Text style = {styles.rewardCta}>Resgatar</Text>
        </View>
        </View>
        </View>
        </TouchableOpacity>

        {/*Indique um amigo*/}

    


        </View>
   
        </ScrollView>
    );
    }   
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },

  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 32,
    fontWeight: "800", 
    color: COLORS.onSurface,
    marginBottom: 16,
  },

    subtitle: {
    fontFamily: "Manrope-Regular",
    fontSize: 18,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
    marginBottom: 24,
  },

  rewardHeader: {
    fontFamily: "Manrope-Bold",
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.onSurface,
    marginBottom: 16,
  },

  rewardsList: {
    flexDirection: "column",
    gap: 15,
  },
  rewardCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 10,
    
  },
  rewardTitle: {
    fontSize: 20,
    fontFamily: "Manrope-Bold",
    color: COLORS.onSurface,
    marginBottom: 10,
  },
  rewardPoints:{
    fontSize: 18,
    fontFamily: "Manrope-Bold",
    color: COLORS.primary,
    marginTop: 10,
  },
  rewardDescription: {
    fontSize: 14,
    fontFamily: "Manrope-Regular",
    color: COLORS.onSurface,
    marginBottom: 10,
  },
    rewardButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    
  },
    rewardCta: {
    fontSize: 16,
    fontFamily: "Manrope-Bold",
    color: COLORS.background,
  },
  rewardContent: {
   padding: 12,
  },
   bentoGrid: { gap: 16, marginBottom: 16 },
  summaryCard: {
    backgroundColor: COLORS.primaryContainer,
    borderRadius: 24,
    padding: 20,
    minHeight: 156,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "stretch",
  },
  summaryColumn: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
    zIndex: 2,
  },
  summaryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  summaryValue: {
    fontFamily: "Manrope-Bold",
    fontSize: 38,
    color: COLORS.onPrimary,
  },
  summaryLabel: {
    color: COLORS.onPrimary,
    fontSize: 13,
    fontFamily: "Manrope-Bold",
    lineHeight: 18,
    marginTop: 4,
  },
  summaryBgIcon: { position: "absolute", bottom: -20, right: -8 },
});              

