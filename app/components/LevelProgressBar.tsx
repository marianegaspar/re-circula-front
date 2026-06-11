import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LevelInfo } from "../utils/levels";

interface LevelProgressBarProps {
  levelInfo: LevelInfo;
}

export function LevelProgressBar({ levelInfo }: LevelProgressBarProps) {
  const progressPercent = Math.min(100, levelInfo.progress);

  const router = useRouter();

  return (
 <TouchableOpacity
   onPress={() => router.push("/rewards/index-rewards")}>
    <LinearGradient
      colors={["#1a9e65", "#0fd97e"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Círculos decorativos de fundo */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Header — pontos + badge de nível */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.points}>
            {levelInfo.currentPoints.toLocaleString()}
          </Text>
          <Text style={styles.pointsLabel}>pontos</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>
            🏆 {levelInfo.name}
          </Text>
        </View>
      </View>

      {/* Barra de progresso + próximo nível */}
      <View style={styles.barRow}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        {levelInfo.nextLevel && (
          <Text style={styles.nextLabel}>
            {levelInfo.pointsNeeded?.toLocaleString()} pts → {levelInfo.nextLevel.name}
          </Text>
        )}
      </View>
    </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden",
    gap: 16,
  },
  bgCircle1: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -24,
    right: -24,
  },
  bgCircle2: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -30,
    right: 50,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  points: {
    fontFamily: "Manrope-Bold",
    fontSize: 42,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: -2,
    lineHeight: 42,
  },
  pointsLabel: {
    fontFamily: "Manrope-Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 3,
  },
  levelBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  levelBadgeText: {
    fontFamily: "Manrope-Bold",
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  barRow: {
    gap: 6,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  nextLabel: {
    fontFamily: "Manrope-Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    textAlign: "right",
  },
});
