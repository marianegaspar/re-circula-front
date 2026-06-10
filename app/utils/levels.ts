/**
 * Sistema de Níveis de Gamificação
 * Calcula o nível baseado no saldo de pontos do usuário
 */

export interface LevelInfo {
  level: number;
  name: string;
  emoji: string;
  minPoints: number;
  maxPoints: number;
  progress: number; // 0-100
  currentPoints: number;
  pointsNeeded: number; // pontos faltantes para próximo nível
  nextLevel?: {
    name: string;
    emoji: string;
    minPoints: number;
  };
}

export const LEVELS = [
  {
    level: 1,
    name: "Eco Iniciante",
    emoji: "🌱",
    minPoints: 0,
    maxPoints: 199,
  },
  {
    level: 2,
    name: "Eco Consciente",
    emoji: "♻️",
    minPoints: 200,
    maxPoints: 499,
  },
  {
    level: 3,
    name: "Eco Protetor",
    emoji: "🌍",
    minPoints: 500,
    maxPoints: 999,
  },
  {
    level: 4,
    name: "Guardião Verde",
    emoji: "🌳",
    minPoints: 1000,
    maxPoints: 1999,
  },
  {
    level: 5,
    name: "Eco Mestre",
    emoji: "🏆",
    minPoints: 2000,
    maxPoints: Infinity,
  },
];

/**
 * Retorna informações de nível baseado na quantidade de pontos
 * @param points - Saldo de pontos do usuário
 * @returns Informações do nível atual e próximo nível
 */
export function getLevel(points: number): LevelInfo {
  const currentLevelInfo = LEVELS.find(
    (level) => points >= level.minPoints && points <= level.maxPoints
  );

  if (!currentLevelInfo) {
    // Fallback para o último nível se algo der errado
    return getLevelInfo(LEVELS[LEVELS.length - 1], points);
  }

  return getLevelInfo(currentLevelInfo, points);
}

/**
 * Calcula as informações detalhadas de um nível
 */
function getLevelInfo(levelInfo: (typeof LEVELS)[number], points: number): LevelInfo {
  const nextLevelInfo = LEVELS[LEVELS.findIndex((l) => l.level === levelInfo.level) + 1];

  // Calcula progresso dentro do nível atual
  const levelStart = levelInfo.minPoints;
  const levelEnd = levelInfo.maxPoints === Infinity ? levelInfo.minPoints + 1000 : levelInfo.maxPoints;
  const pointsInLevel = points - levelStart;
  const pointsPerLevel = levelEnd - levelStart;
  const progressPercent = Math.min(100, (pointsInLevel / pointsPerLevel) * 100);

  return {
    level: levelInfo.level,
    name: levelInfo.name,
    emoji: levelInfo.emoji,
    minPoints: levelInfo.minPoints,
    maxPoints: levelInfo.maxPoints,
    progress: progressPercent,
    currentPoints: points,
    pointsNeeded: nextLevelInfo ? Math.max(0, nextLevelInfo.minPoints - points) : 0,
    nextLevel: nextLevelInfo
      ? {
          name: nextLevelInfo.name,
          emoji: nextLevelInfo.emoji,
          minPoints: nextLevelInfo.minPoints,
        }
      : undefined,
  };
}

/**
 * Retorna descrição amigável do progresso
 */
export function getProgressDescription(levelInfo: LevelInfo): string {
  if (!levelInfo.nextLevel) {
    return "🏆 Você atingiu o topo! Parabéns!";
  }

  return `${levelInfo.pointsNeeded} pontos para ${levelInfo.nextLevel.emoji} ${levelInfo.nextLevel.name}`;
}
