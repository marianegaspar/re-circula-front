import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAppFonts } from "../../hooks/use-App-Fonts";
import { COLORS } from "../themes";


const { width: screenWidth } = Dimensions.get("window");
const cardWidth = (screenWidth - 40 - 12) / 2;

// 1. Interfaces e Tipagens
type CategoriaId = 'branca' | 'eletronicos' | 'informatica' | 'climatizacao';

interface Categoria {
  id: CategoriaId;
  titulo: string;
  subtitulo: string;
  icon: string;
}

const CATEGORIAS: Categoria[] = [
  { id: 'branca', titulo: 'Linha Branca', subtitulo: 'Grandes eletros', icon: 'kitchen' },
  { id: 'eletronicos', titulo: 'Eletrônicos', subtitulo: 'TVs e Áudio', icon: 'devices' },
  { id: 'informatica', titulo: 'Informática', subtitulo: 'PCs e Acessórios', icon: 'laptop_mac' },
  { id: 'climatizacao', titulo: 'Climatização', subtitulo: 'Ar e Ventilação', icon: 'ac_unit' },
];


export default function ColectScreen() {
  const { fontsLoaded } = useAppFonts();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaId | null>(null);
  const [quantidade, setQuantidade] = useState<number>(0);

  if (!fontsLoaded) {
    return null; // O App fica travado na Splash Screen até as fontes estarem prontas
  }
// 3. Handlers
  const alterarQuantidade = (fator: number) => {
    setQuantidade(prev => Math.max(0, prev + fator));
  };

  return (

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brand}>
            <MaterialIcons name="eco" size={28} color={COLORS.primary} />
            <Text style={styles.logoText}> ReCircula </Text>
          </View>
          <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.onSurface}
            />
          </TouchableOpacity>
        </View>

{/* Conteúdo Rolável */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
     
        {/* Step Indicator */}
        <View style={styles.stepContainer}>
          <View style={styles.stepLine} />
          
          <View style={styles.stepWrapper}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={styles.stepDotTextActive}>1</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Itens</Text>
          </View>

          <View style={styles.stepWrapper}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Data</Text>
          </View>

          <View style={styles.stepWrapper}>
            <View style={styles.stepDot}>
              <Text style={styles.stepDotText}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Confirma</Text>
          </View>
        </View>

        {/* Editorial Header */}
        <View style={styles.editorialContainer}>
          <Text style={styles.tituloPrincipal}>
            O que vamos <Text style={styles.textHighlight}>recircular</Text> hoje?
          </Text>
          <Text style={styles.subtituloPrincipal}>
            Selecione as categorias dos itens que deseja descartar de forma consciente.
          </Text>
        </View>

{/* Category Grid */}
        <View style={styles.gridCategorias}>
          {CATEGORIAS.map((cat) => {
            const isSelected = categoriaSelecionada === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                onPress={() => setCategoriaSelecionada(cat.id)}
                style={[
                  styles.cardCategoria,
                  isSelected ? styles.cardCategoriaSelected : styles.cardCategoriaUnselected
                ]}
              >
                {isSelected && (
                  <View style={styles.checkIconPosition}>
                    <MaterialIcons name="check-circle" size={20} color="#4edea3" />
                  </View>
                )}
                
                <View style={[
                  styles.iconWrapper, 
                  isSelected ? styles.iconWrapperSelected : styles.iconWrapperUnselected
                ]}>
                  <MaterialIcons name={cat.icon as any} size={28} color="#4edea3" />
                </View>

                <Text style={styles.cardTitulo}>{cat.titulo}</Text>
                <Text style={[
                  styles.cardSubtitulo,
                  isSelected ? styles.cardSubtituloSelected : styles.cardSubtituloUnselected
                ]}>
                  {cat.subtitulo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

{/* Quantity Selector Bento Box */}
        <View style={styles.bentoContainer}>
          <Text style={styles.bentoLabel}>Quantidade de itens</Text>
          <View style={styles.contadorControl}>
            <TouchableOpacity 
              style={styles.btnContadorAction} 
              onPress={() => alterarQuantidade(-1)}
            >
              <Text style={styles.btnContadorTexto}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.contadorValor}>
              {quantidade === 0 ? '0' : quantidade.toString().padStart(2, '0')}
            </Text>
            
            <TouchableOpacity 
              style={[styles.btnContadorAction, styles.btnContadorActionPlus]} 
              onPress={() => alterarQuantidade(1)}
            >
              <Text style={[styles.btnContadorTexto, styles.btnContadorTextoPlus]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

     {/* Footer Action Button */}
        <View style={styles.footerActionContainer}>
          <TouchableOpacity style={styles.btnPrincipal} activeOpacity={0.9}>
            <Text style={styles.btnPrincipalTexto}>Continuar Agendamento</Text>
          </TouchableOpacity>
          
          <View style={styles.infoTaxaContainer}>
            <MaterialIcons name="info" size={14} color="#bbcabf" />
            <Text style={styles.infoTaxaTexto}>
              Taxa de coleta sob consulta para itens de grande porte.
            </Text>
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
    padding: 20,
  },

  scrollContent: {},

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  brand: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "Manrope-Bold",
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.onSurface,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Manrope-Regular",
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
    borderColor: COLORS.outline + "10",
    overflow: "hidden",
  },
 // Step Indicator
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 240,
    alignSelf: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  stepLine: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#2d3449',
    zIndex: 0,
  },
  stepWrapper: {
    alignItems: 'center',
    zIndex: 1,
    gap: 6,
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2d3449',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  stepDotText: {
    color: '#bbcabf',
    fontWeight: 'bold',
  },
  stepDotTextActive: {
    color: '#003824',
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#bbcabf',
  },
  stepLabelActive: {
    color: '#4edea3',
  },

  // Editorial Header
  editorialContainer: {
    marginBottom: 32,
  },
  tituloPrincipal: {
    fontSize: 32,
    fontWeight: '800',
    color: '#dae2fd',
    lineHeight: 40,
    marginBottom: 12,
  },
  textHighlight: {
    color: '#4edea3',
  },
  subtituloPrincipal: {
    fontSize: 15,
    color: '#bbcabf',
    lineHeight: 22,
    maxWidth: 320,
  },
  // Grid Categorias
  gridCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  cardCategoria: {
    width: cardWidth,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    position: 'relative',
  },
  cardCategoriaUnselected: {
    backgroundColor: '#131b2e',
    borderColor: 'rgba(60, 74, 66, 0.2)',
  },
  cardCategoriaSelected: {
    backgroundColor: '#222a3d',
    borderColor: '#4edea3',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  checkIconPosition: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapperUnselected: {
    backgroundColor: '#2d3449',
  },
  iconWrapperSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  cardTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#dae2fd',
  },
  cardSubtitulo: {
    fontSize: 10,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: -0.3,
  },
  cardSubtituloUnselected: {
    color: '#bbcabf',
  },
  cardSubtituloSelected: {
    color: '#4edea3',
  },
  
  // Bento Quantity
  bentoContainer: {
    backgroundColor: '#060e20',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
  },
  bentoLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#bbcabf',
    marginBottom: 16,
  },
  contadorControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#171f33',
    borderRadius: 30,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(60, 74, 66, 0.2)',
  },
  btnContadorAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2d3449',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContadorActionPlus: {
    backgroundColor: '#10b981',
  },
  btnContadorTexto: {
    color: '#dae2fd',
    fontSize: 20,
    fontWeight: 'bold',
  },
  btnContadorTextoPlus: {
    color: '#003824',
  },
  contadorValor: {
    fontSize: 28,
    fontWeight: '800',
    color: '#dae2fd',
  },
  // Impact Banner
  impactBanner: {
    backgroundColor: 'rgba(6, 78, 59, 0.2)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  impactIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactTextWrapper: {
    flex: 1,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#dae2fd',
    marginBottom: 4,
  },
  impactDescription: {
    fontSize: 13,
    color: '#bbcabf',
    lineHeight: 18,
  },
  impactHighlight: {
    color: '#34d399',
    fontWeight: '700',
  },
  // Footer Button
  footerActionContainer: {
    alignItems: 'center',
    gap: 16,
  },
  btnPrincipal: {
    width: '100%',
    maxWidth: 340,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  btnPrincipalTexto: {
    color: '#003824',
    fontSize: 16,
    fontWeight: '700',
  },
  infoTaxaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoTaxaTexto: {
    fontSize: 11,
    color: '#bbcabf',
  },
  // Bottom Navigation Bar
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 12 : 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  navItemActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  navText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  navTextActive: {
    color: '#4edea3',
    fontWeight: '700',
  },
});
