import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAppFonts } from "../../hooks/use-App-Fonts";
import { COLORS } from "../themes";

export default function HowItWorks(){
    const router = useRouter();
    const { fontsLoaded } = useAppFonts();
    
      if (!fontsLoaded) {
        return null;
      }

    return(
            <ScrollView contentContainerStyle={styles.container}>

      {/* topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity style={styles.backBtn} 
        onPress={() =>  router.push({
            pathname: "/rewards"})}>
          <IconArrowLeft size={16} color="#8a9bb0" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Como Funciona</Text>
      </View>

      <Text style={styles.intro}>
        Transforme eletrônicos descartados em pontos e troque por recompensas reais.
      </Text>

      {/* passo 1 */}
      <StepCard
        number="1"
        color="green"
        title="Entregue em um ecoponto"
        desc="Leve seus eletrônicos a um ponto parceiro"
      >
        <Highlight color="green" emoji="📍" value="+50 pts" label="por entrega confirmada" />
        <Bullet color="green" text="Confirme a entrega pelo app para pontuar" />
        <Bullet color="green" text="Bônus na primeira entrega do mês" />
      </StepCard>

      {/* passo 2 */}
      <StepCard
        number="2"
        color="blue"
        title="Agende uma coleta"
        desc="Receba em casa, sem sair de onde você está"
      >
        <Highlight color="blue" emoji="🚛" value="+100 pts" label="por coleta domiciliar concluída" />
        <Bullet color="blue" text="Pontos calculados pelo volume e tipo de material" />
        <Bullet color="blue" text="Cupons especiais após confirmação" />
      </StepCard>

      {/* passo 3 */}
      <StepCard
        number="3"
        color="purple"
        title="Suba de nível e resgate"
        desc="Quanto mais pontos, maiores os benefícios"
      >
        <LevelsStrip />
        <Bullet color="purple" text="Troque pontos por vouchers, descontos e doações" />
        <Bullet color="purple" text="Acompanhe o progresso na barra de nível" />
      </StepCard>

      {/* cta */}
      <TouchableOpacity
        style={styles.ctaCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Coleta")}
      >
        <View style={styles.ctaBg} />
        <View style={styles.ctaIcon}>
          <Text style={styles.ctaEmoji}>♻️</Text>
        </View>
        <View style={styles.ctaText}>
          <Text style={styles.ctaTitle}>Pronta para começar?</Text>
          <Text style={styles.ctaSub}>Encontre um ecoponto perto de você agora</Text>
        </View>
        <View style={styles.ctaArrow}>
          <IconArrowRight size={14} color="#fff" />
        </View>
      </TouchableOpacity>

    </ScrollView>
  );
}

/* ─── sub-componentes ─── */

type Color = "green" | "blue" | "purple";

function StepCard({
  number, color, title, desc, children,
}: {
  number: string;
  color: Color;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepNum, stepNumBg[color]]}>
          <Text style={[styles.stepNumText, stepNumColor[color]]}>{number}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.stepTitle}>{title}</Text>
          <Text style={styles.stepDesc}>{desc}</Text>
        </View>
      </View>
      <View style={styles.stepBody}>{children}</View>
    </View>
  );
}

function Highlight({ color, emoji, value, label }: {
  color: Color; emoji: string; value: string; label: string;
}) {
  return (
    <View style={[styles.highlight, highlightBg[color]]}>
      <Text style={styles.highlightEmoji}>{emoji}</Text>
      <View>
        <Text style={[styles.highlightValue, highlightColor[color]]}>{value}</Text>
        <Text style={styles.highlightLabel}>{label}</Text>
      </View>
    </View>
  );
}

function Bullet({ color, text }: { color: Color; text: string }) {
  return (
    <View style={styles.bullet}>
      <View style={[styles.bulletDot, bulletColor[color]]} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const LEVELS = [
  { emoji: "🌱", name: "Iniciante" },
  { emoji: "♻️", name: "Consciente" },
  { emoji: "🌍", name: "Protetor" },
  { emoji: "🌳", name: "Guardião" },
  { emoji: "🏆", name: "Mestre" },
];

function LevelsStrip() {
  return (
    <View style={styles.levelsStrip}>
      {LEVELS.map((l) => (
        <View key={l.name} style={styles.levelPill}>
          <Text style={styles.levelEmoji}>{l.emoji}</Text>
          <Text style={styles.levelName}>{l.name}</Text>
        </View>
      ))}
    </View>
  );
}

/* ─── color maps ─── */

const stepNumBg: Record<Color, object> = {
  green: { backgroundColor: "#2ecc8a" },
  blue:  { backgroundColor: "#4fa3e8" },
  purple:{ backgroundColor: "#c084f5" },
};
const stepNumColor: Record<Color, object> = {
  green: { color: "#04342c" },
  blue:  { color: "#fff" },
  purple:{ color: "#fff" },
};
const highlightBg: Record<Color, object> = {
  green:  { backgroundColor: "rgba(46,204,138,0.07)",  borderColor: "rgba(46,204,138,0.18)" },
  blue:   { backgroundColor: "rgba(79,163,232,0.07)",  borderColor: "rgba(79,163,232,0.18)" },
  purple: { backgroundColor: "rgba(192,132,245,0.07)", borderColor: "rgba(192,132,245,0.18)" },
};
const highlightColor: Record<Color, object> = {
  green:  { color: "#2ecc8a" },
  blue:   { color: "#4fa3e8" },
  purple: { color: "#c084f5" },
};
const bulletColor: Record<Color, object> = {
  green:  { backgroundColor: "#2ecc8a" },
  blue:   { backgroundColor: "#4fa3e8" },
  purple: { backgroundColor: "#c084f5" },
};

/* ─── styles ─── */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 16,
    gap: 10,
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  backBtn: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: "#162230",
    borderWidth: 0.5,
    borderColor: "#1e3045",
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: {
    fontFamily: "Manrope-Bold",
    fontSize: 24,
    fontWeight: "600",
    color: "#e8f0f8",
  },
  intro: {
    fontFamily: "Manrope-Regular",
    fontSize: 13,
    color: "#5a7490",
    lineHeight: 20,
  },

  // step card
  stepCard: {
    backgroundColor: "#162230",
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: "#1e3045",
    overflow: "hidden",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  stepNum: {
    width: 32, height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepNumText: {
    fontFamily: "Manrope-Bold",
    fontSize: 13,
    fontWeight: "600",
  },
  stepTitle: {
    fontFamily: "Manrope-Bold",
    fontSize: 14,
    fontWeight: "600",
    color: "#e8f0f8",
  },
  stepDesc: {
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    color: "#5a7490",
    marginTop: 2,
  },
  stepBody: {
    borderTopWidth: 0.5,
    borderTopColor: "#1e3045",
    padding: 14,
    gap: 8,
  },

  // highlight
  highlight: {
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  highlightEmoji: { fontSize: 22 },
  highlightValue: {
    fontFamily: "Manrope-Bold",
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: -1,
    lineHeight: 24,
  },
  highlightLabel: {
    fontFamily: "Manrope-Regular",
    fontSize: 11,
    color: "#5a7490",
    marginTop: 2,
  },

  // bullet
  bullet: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bulletDot: {
    width: 5, height: 5,
    borderRadius: 3,
    marginTop: 5,
    flexShrink: 0,
  },
  bulletText: {
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    color: "#8a9bb0",
    lineHeight: 18,
    flex: 1,
  },

  // levels strip
  levelsStrip: {
    flexDirection: "row",
    gap: 5,
  },
  levelPill: {
    flex: 1,
    backgroundColor: "#0f1923",
    borderWidth: 0.5,
    borderColor: "#1e3045",
    borderRadius: 9,
    padding: 6,
    alignItems: "center",
  },
  levelEmoji: { fontSize: 14, marginBottom: 2 },
  levelName: {
    fontFamily: "Manrope-Regular",
    fontSize: 9,
    color: "#5a7490",
    textAlign: "center",
  },

  // cta
  ctaCard: {
    backgroundColor: "#1a9e65",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    overflow: "hidden",
    position: "relative",
  },
  ctaBg: {
    position: "absolute",
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -20, right: -20,
  },
  ctaIcon: {
    width: 44, height: 44,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ctaEmoji: { fontSize: 22 },
  ctaText: { flex: 1 },
  ctaTitle: {
    fontFamily: "Manrope-Bold",
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 3,
  },
  ctaSub: {
    fontFamily: "Manrope-Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 15,
  },
  ctaArrow: {
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});