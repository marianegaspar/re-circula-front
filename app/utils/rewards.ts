/**
 * Utilitários para gerenciar e rastrear recompensas de pontos
 * Evita múltiplas concessões para o mesmo evento
 */

import { arrayUnion, doc, getDoc, increment, runTransaction, updateDoc } from "firebase/firestore";
import { db } from "../../src/services/firebase";

/**
 * Estados possíveis de uma recompensa
 */
export enum RewardStatus {
  PENDING = "pending", // Ainda não recompensado
  AWARDED = "awarded", // Já recebeu os pontos
  CLAIMED = "claimed", // Usuário confirmou que recebeu
}

/**
 * Tipos de recompensas
 */
export enum RewardType {
  COLLECTION_POINT_DELIVERY = "collection_point_delivery", // Entrega em ponto (50 pontos)
  HOME_PICKUP = "home_pickup", // Coleta domiciliar (80 pontos)
}

/**
 * Verifica se uma entrega em ponto já foi recompensada
 * @param collectionPointId - ID do ponto de coleta
 * @param userId - ID do usuário
 * @returns true se já foi recompensado, false caso contrário
 */
export async function hasBeenAwarded(
  collectionPointId: string,
  userId: string
): Promise<boolean> {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    // Verifica se existe um array de deliveries recompensados
    const awardedDeliveries = userData?.awardedPointDeliveries || [];
    return awardedDeliveries.includes(collectionPointId);
  } catch (error) {
    console.error("[REWARDS] Erro ao verificar recompensa:", error);
    return false;
  }
}

/**
 * Marca uma entrega em ponto como recompensada e adiciona pontos
 * @param collectionPointId - ID do ponto de coleta
 * @param userId - ID do usuário
 * @param points - Número de pontos a adicionar (padrão 50)
 * @returns true se foi bem-sucedido, false caso contrário
 */
export async function awardDeliveryPoints(
  collectionPointId: string,
  userId: string,
  points: number = 50
): Promise<boolean> {
  try {
    console.log("[AWARDS] Iniciando award de", points, "para entrega", collectionPointId);

    // Verifica se já foi recompensado
    const alreadyAwarded = await hasBeenAwarded(collectionPointId, userId);
    if (alreadyAwarded) {
      console.warn("[AWARDS] Entrega já foi recompensada:", collectionPointId);
      return false;
    }

    const userRef = doc(db, "users", userId);

    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const userData = userDoc.exists() ? userDoc.data() : {};
      const deliveries = Array.isArray(userData?.awardedPointDeliveries)
        ? userData.awardedPointDeliveries
        : [];

      if (deliveries.includes(collectionPointId)) {
        throw new Error("Entrega já recompensada");
      }

      transaction.set(
        userRef,
        {
          pointsBalance: increment(points),
          awardedPointDeliveries: arrayUnion(collectionPointId),
        },
        { merge: true }
      );
    });

    console.log("[AWARDS] Award concluído com sucesso");
    return true;
  } catch (error: unknown) {
    console.error("[AWARDS] Erro ao adicionar pontos de entrega:", error);
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("Entrega já recompensada")) {
      return false;
    }
    throw error;
  }
}

/**
 * Adiciona pontos de coleta domiciliar (com proteção de duplicidade via scheduleId)
 * @param scheduleId - ID do agendamento
 * @param userId - ID do usuário
 * @param ecoPoints - Número de pontos a adicionar
 * @returns true se foi bem-sucedido
 */
export async function awardPickupPoints(
  scheduleId: string,
  userId: string,
  ecoPoints: number
): Promise<boolean> {
  try {
    console.log("[AWARDS] Adicionando", ecoPoints, "pontos para coleta", scheduleId);

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      pointsBalance: increment(ecoPoints),
      lastAwardedSchedule: scheduleId,
      lastAwardedAt: new Date(),
    });

    console.log("[AWARDS] Pontos de coleta adicionados");
    return true;
  } catch (error) {
    console.error("[AWARDS] Erro ao adicionar pontos de coleta:", error);
    throw error;
  }
}
