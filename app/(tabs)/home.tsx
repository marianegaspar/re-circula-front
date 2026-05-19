import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAppFonts } from "../../hooks/use-App-Fonts";
import { COLORS } from "../themes";


export default function HomeScreen(){
    const { fontsLoaded } = useAppFonts();
  
    if (!fontsLoaded) {
      return null; // O App fica travado na Splash Screen até as fontes estarem prontas
    }

    const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    
  }
  });
    
    return(

  <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

  <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="eco" size={28} color={COLORS.primary} />
        <Text style={styles.logoText}> ReCircula </Text>
            <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={COLORS.onSurface} />
        </TouchableOpacity>
      </View>
       
    {/* Welcome */}
    <Text style={styles.title}>Olá, Mariane</Text>
     <Text style={styles.subtitle}>Seu impacto positivo hoje ajuda o amanhã.</Text>

     {/* Bento Grid: Impacto */}
        <View style={styles.bentoGrid}>
          {/* Card Principal Largo */}
          <View style={styles.mainImpactCard}>
            <View style={styles.z10}>
              <Text style={styles.labelCaps}>TOTAL ECONOMIZADO</Text>
              <View style={styles.valueRow}>
                <Text style={styles.mainValue}>12.8</Text>
                <Text style={styles.unit}>kg</Text>
              </View>
              <Text style={styles.description}>
                Equivalente a <Text style={{ color: COLORS.primary, fontWeight: '700' }}>3 árvores</Text> plantadas este mês.
              </Text>
            </View>
            <MaterialIcons name="recycling" size={80} color={COLORS.primary + '15'} style={styles.bgIcon} />
          </View>
       
  {/* Cards Menores */}
          <View style={styles.row}>
            <View style={styles.smallCard}>
              <MaterialIcons name="devices" size={24} color={COLORS.tertiary} />
              <View>
                <Text style={styles.smallCardValue}>14</Text>
                <Text style={styles.smallCardLabel}>ITENS COLETADOS</Text>
              </View>
            </View>

            <View style={styles.smallCard}>
              <MaterialIcons name="eco" size={24} color={COLORS.primary} />
              <View>
                <Text style={styles.smallCardValue}>850g</Text>
                <Text style={styles.smallCardLabel}>CO2 EVITADO</Text>
              </View>
            </View>
          </View>
        </View>

          {/* CTA COLETA */}
         
          <TouchableOpacity style={styles.collectCardContent}>
            <View style={{flex:1, flexDirection:'column'}}>
              <Text style={styles.labelTitle}>SOLICITAR COLETA</Text>
  
              <Text style={styles.labelDescription}>
                Agende a coleta de seus resíduos eletrônicos de forma rápida e fácil.
              </Text>
           </View>

            <View style={styles.actionIconCircle}>
              <MaterialIcons name="send" size={20} color={COLORS.onPrimary} />
            </View>
           </TouchableOpacity>

            {/* Pontos de Coleta */}
            <View style={{ marginTop: 24 }}>
            <Text style={styles.title}>Pontos de Coleta Perto de Você</Text>
            </View>

            <TouchableOpacity style={styles.seeAll}>
            <Text style={styles.seeAllText}>Ver todos</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.outline} />
          </TouchableOpacity>

            {/* COLLECTION LIST */}
        <View style={styles.collectionList}>
          {[
            {
              icon: 'location-on',
              title: 'Centro Logístico EcoSP',
              distance: '1.2km',
            },
            {
           icon: 'location-on',
              title: 'Ponto Tech Moema',
              distance: '2.5km',
            },
            {
          icon: 'location-on',
              title: 'Recicla Digital Pinheiros',
              distance: '3.1km',
            },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.collectionItem}>
              <View style={styles.collectionIcon}>
                      <MaterialIcons
                  name={item.icon as any}
                  size={24}
                  color={COLORS.primary}  
                />
  
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.collectionTitle}>{item.title}</Text>

                <Text style={styles.collectionDistance}>
                  A {item.distance} de distância
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          ))}
        </View>








          
</View>
        
</ScrollView>

    );
}

const styles = StyleSheet.create({

      container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
      },

        scrollContent: {
 
  },

        header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
    logoText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginLeft: 8,
    letterSpacing: -1,
  },
  title: {
    fontFamily: 'Manrope-Bold',
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.onSurface,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: COLORS.onSurfaceVariant,
    lineHeight: 16,
    marginBottom: 24,
  },

bentoGrid: { gap: 16, marginBottom: 16 },
  mainImpactCard: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.outline + '10',
    overflow: 'hidden',
  },
  z10: { zIndex: 10 },
  labelCaps: { fontSize: 10, color: COLORS.primary, letterSpacing: 1 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 8 },
  mainValue: {  fontFamily:'Manrope-ExtraBold',fontSize: 48, color: COLORS.onSurface },
  unit: {  fontSize: 20, color: COLORS.onSurfaceVariant },
  description: { color: COLORS.onSurfaceVariant, fontSize: 14, marginTop: 8 },
  bgIcon: { position: 'absolute', bottom: 60, right: 20 },

  row: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  smallCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.outline+ '10',
  },
  smallCardValue: { fontSize: 24, color: COLORS.onSurface },
  smallCardLabel: { fontSize: 9, color: COLORS.onSurfaceVariant, letterSpacing: 1, marginBottom: 4 },

collectCard: { gap: 16, marginBottom: 16 },
  collectCardContent: {
    backgroundColor: COLORS.tertiary,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.outline + '10',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconCircle: { width: 48,
     height: 48, 
     borderRadius: 24, 
     backgroundColor: 'rgba(255,255,255,0.2)', 
     justifyContent: 'center', 
     alignItems: 'center',
      marginBottom: 12 },

  labelTitle: { fontSize: 16, color: COLORS.onPrimary, letterSpacing: 1, fontWeight: '700' },
  labelDescription: { color: COLORS.onPrimary + 'cc', 
    fontSize: 14, 
    fontFamily:'Inter-Regular',
    marginTop: 8, 
    lineHeight: 16},

    seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
      marginBottom: 12,
  },

  seeAllText: {
    color:COLORS.outline,
    fontWeight: '600',
  
  },

    mapContainer: {
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {    flex: 1,
  },

   collectionList: {
    gap: 12,
    marginBottom: 24,
  },

  collectionItem: {
    backgroundColor: COLORS.surfaceContainer  ,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  collectionIcon: {
    height: 50,
    width: 50,
    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',
  },

  collectionTitle: {
    fontFamily:'Manrope-Bold',
    color: COLORS.onSurface,
  },

  collectionDistance: {
    marginTop: 4,
    color: COLORS.onSurfaceVariant,
    fontSize: 12,
  },


      
});